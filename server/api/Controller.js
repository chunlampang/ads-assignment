const mongoPool = require.main.require('./utils/mongoPool');
const { ObjectId } = require('mongodb');

module.exports = class Controller {
    constructor(entity) {
        this.entity = entity;
    }

    getId(req) {
        if (!this.entity.fields._id)
            return ObjectId(req.params.id);
        return req.params.id;
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

