const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');
const { ObjectId } = require('mongodb');
const { entities, fieldsets } = require.main.require('./configs');

module.exports = class Controller {
    constructor(entity) {
        this.entity = entity;
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

    appendMatch($match, filter) {
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
                    this.appendMatch($match, subFilter);
                }
                continue;
            }
            let operation = this.parseQueryField(field, fieldName, filter);
            if (operation)
                $match[fieldName] = operation;
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
                this.appendMatch($match, filter);
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

    async query(req, res, appendJoinOptions) {
        let out;
        try {
            let options = [];
            //filter
            let filter = req.query.filter;
            if (filter) {
                const $match = {};
                this.appendMatch($match, filter);
                console.log('$match:', $match);
                options.push({ $match });
            }
            //join
            if (req.query.join) {
                appendJoinOptions(req.query, options);
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
            const db = await mongoPool.getDb();
            const collection = db.collection(this.entity.collection);

            let result = await collection.findOne({ _id: this.getId(req) });

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
            console.log(`${data._id} is inserted`);
            out = { ok: !!result.n, data };
            res.status(201);
        } catch (err) {
            if (err.code == 11000) {
                let field;
                if (this.entity.desc && this.entity.desc.key) {
                    field = this.entity.desc.key;
                } else
                    field = '_id';
                out = { error: data[field] + ' is used by other.' };
            } else
                out = { error: err.message };
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
            console.log(`${_id} is updated`);

            out = { ok: !!result.nModified, data };
        } catch (err) {
            if (err.code == 66)
                out = { error: '_id must not be updated.' };
            else
                out = { error: err.message };
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

            let { result } = await collection.deleteOne({ _id });

            if (result.n > 0) {
                console.log(`${_id} is deleted`);
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

function runCal(item, _fcItem) {
    item[_fcItem.field] = eval(_fcItem.fc);
}