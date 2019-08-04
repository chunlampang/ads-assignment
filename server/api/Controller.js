const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');
const { ObjectId } = require('mongodb');
const entities = require.main.require('./entities');

module.exports = class Controller {
    constructor(entity) {
        this.entity = entity;
    }

    getId(req) {
        if (!this.entity.fields._id)
            return ObjectId(req.params.id);
        return req.params.id;
    }

    async query(req, res) {
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
                            if (!ids.length) continue;

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
                                if (field.rules.includes("integer")) {
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
                options.push({ $match });
            }
            //join
            let join = queryHelper.parseArray('join', req.query.join || []);
            if (join.includes('offers')) {
                options.push({
                    $lookup: {
                        from: 'offers',
                        localField: '_id',
                        foreignField: 'enrolled.student',
                        as: '_join.offers'
                    }
                });
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
            const db = await mongoPool.getDb();
            const collection = db.collection(this.entity.collection);
            let { result } = await collection.insertOne(data);
            console.log(`${result.insertedId} is inserted`);
            data._id = result.insertedId;
            out = { ok: !!result.n, data };
            res.status(201);
        } catch (err) {
            if (err.code == 11000)
                out = { error: data._id + ' is used by other.' };
            else
                out = { error: err.message };
            res.status(400);
        }

        res.send(out);
    }

    async update(req, res) {
        let out;
        let data = req.query;
        try {
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

