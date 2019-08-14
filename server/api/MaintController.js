const express = require('express');
const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');
const { ObjectId } = require('mongodb');
const { entities, fieldsets } = require.main.require('./configs');

module.exports = class Controller {
    constructor(entity) {
        this.entity = entity;
        this.entityFields = {};//join one
        this.entitiesFields = {};//join many
        this.findEntityFields(this.entity.fields);
    }

    createRouter() {
        const router = express.Router();
        const route = router.route(`/${this.entity.collection}`);
        const itemRouter = router.route(`/${this.entity.collection}/:id`);
        const optionsRouter = router.route(`/${this.entity.collection}-string-options`);

        route.get((req, res) => this.query(req, res));
        route.post((req, res) => this.insert(req, res));
        itemRouter.get((req, res) => this.get(req, res));
        itemRouter.put((req, res) => this.update(req, res));
        itemRouter.delete((req, res) => this.delete(req, res));
        optionsRouter.get((req, res) => this.queryStringOptions(req, res));

        return router;
    }

    findEntityFields(fields, namespace, inList) {
        for (let fieldName in fields) {
            let field = fields[fieldName];
            if (namespace)
                fieldName = namespace + '.' + fieldName;
            switch (field.type) {
                case 'fieldset':
                    this.findEntityFields(field.fields, fieldName);
                case 'list':
                    this.findEntityFields(field.fields, fieldName, true);
                    continue;
                case 'entity':
                    if (inList)
                        this.entitiesFields[fieldName] = field;
                    else
                        this.entityFields[fieldName] = field;
                    break;
            }
        }
    }

    getId(req) {
        if (!this.entity.fields._id)
            return ObjectId(req.params.id);
        return req.params.id;
    }

    parseData(fields, data, insert) {
        let calOrder = [];

        for (let fieldName in fields) {
            const field = fields[fieldName];

            if (field.cal) {
                if (!calOrder[field.cal.order])
                    calOrder[field.cal.order] = [];
                calOrder[field.cal.order].push({ field: fieldName, fc: field.cal.fc });
            } else {
                if (!data[fieldName]) {
                    if (insert) {
                        if (field.default)
                            data[fieldName] = eval(field.default);
                        else if (field.rules && field.rules.includes('required'))
                            throw new Error(field.label + ' is required.');
                    } else
                        continue;
                }
                switch (field.type) {
                    case 'entity':
                        if (!entities[field.entity].fields._id)
                            data[fieldName] = ObjectId(data[fieldName]);
                        break;
                    case 'date':
                    case 'datetime':
                        data[fieldName] = queryHelper.parseDate(field.label, data[fieldName]);
                        break;
                    case "number":
                        if (field.rules && field.rules.includes("integer")) {
                            if (field.rules.includes("positive"))
                                data[fieldName] = queryHelper.parsePositiveInteger(field.label, data[fieldName]);
                            else
                                data[fieldName] = queryHelper.parseInteger(field.label, data[fieldName]);
                        } else {
                            data[fieldName] = queryHelper.parseNumber(field.label, data[fieldName]);
                        }
                    case 'fieldset':
                        this.parseData(field.fields, data[fieldName], insert);
                        break;
                    case 'list':
                        if (field.rules) {
                            for (let rule of field.rules) {
                                if (typeof rule === "object") {
                                    switch (Object.keys(rule)[0]) {
                                        case "max":
                                            let max;
                                            if (Number.isInteger(rule.max)) {
                                                max = rule.max;
                                            } else {
                                                let fc = function (item) {
                                                    return eval(rule.max);
                                                };
                                                max = fc(data);
                                            }
                                            if (data[fieldName].length > max) {
                                                throw new Error(`${field.label} should not more than ${max} items.`);
                                            }
                                            break;
                                        case "min":
                                            let min;
                                            if (Number.isInteger(rule.min)) {
                                                min = rule.min;
                                            } else {
                                                let fc = function (item) {
                                                    return eval(rule.min);
                                                };
                                                min = fc(data);
                                            }
                                            if (data[fieldName].length < min) {
                                                throw new Error(`${field.label} should not less than ${max} items.`);
                                            }
                                            break;
                                    }
                                }
                            }
                        }
                        for (let item of data[fieldName]) {
                            this.parseData(field.fields, item, insert);
                        }
                        break;
                }
            }
        }

        for (let calIndex in calOrder) {
            let fcItems = calOrder[calIndex];
            for (let fcItem of fcItems) {
                runCal(data, fcItem);
            }
        }

    }

    parseQueryField(field, fieldName, val) {
        switch (field.type) {
            case "entity":
                let ids = queryHelper.parseArray(fieldName, val[fieldName]);
                if (!entities[field.entity].fields._id) {
                    let _ids = [];
                    for (let id of ids)
                        _ids.push(ObjectId(id));
                    ids = _ids;
                }
                return { $in: ids };
            case "number":
            case "date":
            case "datetime":
                let { from, to } = val[fieldName];
                let parseFunc;
                if (field.type === 'number') {
                    if (field.rules && field.rules.includes("integer")) {
                        if (field.rules.includes("positive"))
                            parseFunc = 'parsePositiveInteger';
                        else
                            parseFunc = 'parseInteger';
                    } else {
                        parseFunc = 'parseNumber';
                    }
                } else {
                    parseFunc = 'parseDate';
                }
                let operation;
                if (from || to) {
                    operation = {};
                    if (from)
                        operation.$gte = queryHelper[parseFunc](fieldName + '.from', from);
                    if (to)
                        operation.$lte = queryHelper[parseFunc](fieldName + '.to', to);
                }
                return operation;
            case "string":
                return new RegExp(queryHelper.parseString(fieldName, val[fieldName]), 'i');
        }
    }

    appendFilterOptions($match, filter) {
        for (let fieldName in filter) {
            if (!filter[fieldName])
                continue;

            let dotSegs = fieldName.split('.');

            let field = this.entity.fields[dotSegs[0]];
            if (!field)
                throw new Error('Unknown field: ' + fieldName);

            if (dotSegs.length > 1) {
                switch (field.type) {
                    case 'fieldset':
                    case 'list':
                        //validate dot notation
                        for (let i = 1; i < dotSegs.length; i++) {
                            let dotSeg = dotSegs[i];

                            if (field.type === 'fieldset') {
                                let fieldset = fieldsets[field.fieldset];
                                field = fieldset.fields[dotSeg];
                            } else if (field.type === 'list')
                                field = field.fields[dotSeg];
                            else
                                field = null;

                            if (!field)
                                throw new Error('Unknown field: ' + fieldName);
                        }
                        break;
                    default:
                        throw new Error('Unknown field: ' + fieldName);
                }
            }

            if (field.type === 'fieldset' || field.type === 'list') {
                //object to dot notation
                if (typeof filter[fieldName] === 'object') {
                    let subFilter = {};

                    for (let childFieldName in filter[fieldName]) {
                        subFilter[fieldName + '.' + childFieldName] = filter[fieldName][childFieldName];
                    }
                    this.appendFilterOptions($match, subFilter);
                }
                continue;
            }
            let operation = this.parseQueryField(field, fieldName, filter);
            if (operation)
                $match[fieldName] = operation;
        }
    }

    appendJoinOptions(join, options) {
        join = queryHelper.parseArray('join', join);
        for (let fieldName of join) {
            let field = this.entityFields[fieldName];
            let joinList = false;
            if (!field) {
                field = this.entitiesFields[fieldName];
                joinList = true;
            }
            if (!field)
                throw new Error(`Unknown field ${fieldName} in join.`);

            if (joinList) {
                options.push({
                    $lookup: {
                        from: entities[field.entity].collection,
                        localField: fieldName,
                        foreignField: '_id',
                        as: '_join.' + fieldName
                    }
                });
            } else {
                options.push(
                    {
                        $lookup: {
                            from: entities[field.entity].collection,
                            localField: fieldName,
                            foreignField: '_id',
                            as: '_join.' + fieldName
                        }
                    },
                    {
                        $unwind: {
                            path: '$_join.' + fieldName,
                            preserveNullAndEmptyArrays: true
                        }
                    }
                );
            }
        }
    }

    async queryStringOptions(req, res) {
        let out;
        try {
            let options = [];
            //filter
            let filter = req.query.filter;
            const $match = {};
            if (filter) {
                this.appendFilterOptions($match, filter);
                console.log('$match:', $match);
                options.push({ $match });
            }

            const db = await mongoPool.getDb();
            const collection = db.collection(this.entity.collection);
            out = await queryHelper.aggregateStringOptions(collection, $match, req.query);
        } catch (err) {
            out = { error: err.message };
            res.status(400);
        }

        res.send(out);
    }

    async query(req, res) {
        let out;
        try {
            let options = [];
            //filter
            let filter = req.query.filter;
            if (filter) {
                const $match = {};
                this.appendFilterOptions($match, filter);
                console.log('$match:', $match);
                options.push({ $match });
            }
            //join
            if (req.query.join) {
                this.appendJoinOptions(req.query.join, options);
            }

            const db = await mongoPool.getDb();
            const collection = db.collection(this.entity.collection);
            out = await queryHelper.aggregateList(collection, options, req.query);
        } catch (err) {
            out = { error: err.message };
            res.status(400);
        }

        res.send(out);
    }

    async get(req, res) {
        let out;
        try {

            let { fields } = req.query;
            const options = {};
            if (fields) {
                let projectOptions = {};
                for (let field of queryHelper.parseArray('fields', fields)) {
                    projectOptions[field] = true;
                }
                options.projection = projectOptions;
            }

            const db = await mongoPool.getDb();
            const collection = db.collection(this.entity.collection);
            let result = await collection.findOne({ _id: this.getId(req) }, options);

            out = { data: result };
        } catch (err) {
            out = { error: err.message };
            res.status(400);
        }

        res.send(out);
    }

    async insert(req, res) {
        let out;
        let data = req.body;
        try {
            this.parseData(this.entity.fields, data, true);

            const db = await mongoPool.getDb();
            const collection = db.collection(this.entity.collection);
            let { result } = await collection.insertOne(data);
            if (!data._id)
                data._id = result.insertedId;
            console.log(`Item is inserted`);
            out = { ok: !!result.n, data };
            res.status(201);
        } catch (err) {
            out = handleError(err);
            res.status(400);
        }

        res.send(out);
    }

    async update(req, res) {
        let out;
        let data = req.body;
        try {
            this.parseData(this.entity.fields, data, false);

            const db = await mongoPool.getDb();
            const collection = db.collection(this.entity.collection);
            let _id = this.getId(req);

            let { result } = await collection.updateOne({ _id }, { $set: data });
            console.log(`Item is updated`);

            out = { ok: !!result.nModified, data };
        } catch (err) {
            out = handleError(err);
            res.status(400);
        }
        res.send(out);
    }

    async delete(req, res) {
        let out;
        try {
            const db = await mongoPool.getDb();
            const collection = db.collection(this.entity.collection);
            let _id = this.getId(req);

            if (this.entity.references) {
                for (let refName in this.entity.references) {
                    let ref = this.entity.references[refName];
                    let refEntity = entities[ref.entity];
                    let opt = {};
                    if (this.entity.fields._id)
                        opt[ref.field] = _id;
                    else
                        opt[ref.field] = ObjectId(_id);
                    let count = await db.collection(refEntity.collection).find(opt).count();
                    if (count > 0) {
                        throw new Error(`Item has ${ref.label} record in ${count} ${count > 1 ? refEntity.plural : refEntity.singular}`);
                    }
                }
            }

            let { result } = await collection.deleteOne({ _id });

            if (result.n > 0) {
                console.log(`Item is deleted`);
                out = { ok: true };
            } else
                res.status(404);
        } catch (err) {
            out = { error: err.message };
            res.status(400);
        }
        res.send(out);
    }
}

function handleError(err) {
    switch (err.code) {
        case 11000:
            let keys = err.message.match(/dup key: {(.*?) }/)[1].split(',');
            for (let i = 0; i < keys.length; i++) {
                keys[i] = keys[i].substring(3);
            }
            return { error: keys.join(' + ') + ' is already exist.' };
        case 66:
            return { error: '_id must not be updated.' };
        default:
            return { error: err.message };
    }
}

function runCal(item, _fcItem) {
    item[_fcItem.field] = eval(_fcItem.fc);
}