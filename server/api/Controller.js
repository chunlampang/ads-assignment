const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');
const { ObjectId } = require('mongodb');
const { entities } = require.main.require('./configs');

module.exports = class Controller {
    constructor(entity) {
        this.entity = entity;
    }

    getId(req) {
        if (!this.entity.fields._id)
            return ObjectId(req.params.id);
        return req.params.id;
    }

    parseData(fields, data, checkRequired) {
        let calOrder = [];

        for (let fieldName in fields) {
            const field = fields[fieldName];

            if (field.cal) {
                if (!calOrder[field.cal.order])
                    calOrder[field.cal.order] = [];
                calOrder[field.cal.order].push({ field: fieldName, fc: field.cal.fc });
            } else {
                if (!data[fieldName]) {
                    if (checkRequired && field.rules && field.rules.includes('required'))
                        throw new Error(field.label + ' is required.');
                    continue;
                }
                switch (field.type) {
                    case 'date':
                    case 'datetime':
                        data[fieldName] = queryHelper.parseDate(field.label, data[fieldName]);
                        break;
                    case 'fieldset':
                        this.parseData(field.fields, data[fieldName]);
                        break;
                    case 'list':
                        for (let item in data[fieldName]) {
                            this.parseData(field.fields, item);
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

    async query(req, res, appendJoinOptions) {
        let out;
        try {
            let options = [];
            //filter
            let filter = req.query.filter;
            if (filter) {
                const $match = {};

                const fields = this.entity.fields;
                for (let fieldName in fields) {
                    const field = fields[fieldName];

                    if (!filter[fieldName]) continue;

                    switch (field.type) {
                        case "entity":
                            let ids = queryHelper.parseArray(fieldName, filter[fieldName]);
                            if (!entities[field.entity].fields._id) {
                                let _ids = [];
                                for (let id of ids)
                                    _ids.push(ObjectId(id));
                                ids = _ids;
                            }

                            $match[fieldName] = { $in: ids };
                            break;
                        case "number":
                        case "date":
                        case "datetime":
                            let { from, to } = filter[fieldName];
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
                            if (from || to) {
                                $match[fieldName] = {};
                                if (from)
                                    $match[fieldName].$gte = queryHelper[parseFunc](fieldName + '.from', from);
                                if (to)
                                    $match[fieldName].$lte = queryHelper[parseFunc](fieldName + '.to', to);
                            }
                            break;
                        case "string":
                            $match[fieldName] = new RegExp(queryHelper.parseString(fieldName, filter[fieldName]), 'i')
                            break;
                        default:
                            $match[fieldName] = filter[fieldName];
                    }
                }
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
        let data = req.query;
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
        let data = req.query;
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