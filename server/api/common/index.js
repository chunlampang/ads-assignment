const mongoPool = require.main.require('./utils/mongoPool');

exports.get = function (name) {
    return async function (req, res) {
        let out;
        try {
            const db = await mongoPool.getDb();
            const collection = db.collection(name);
            let result = await collection.findOne({ _id: req.params.id });

            out = { data: result };
        } catch (err) {
            out = { error: err.message };
            res.status(400);
        }

        res.send(out);
    };
}

exports.insert = function (name) {
    return async function (req, res) {
        let out;
        let data = req.query;
        try {
            const db = await mongoPool.getDb();
            const collection = db.collection(name);
            let result = await collection.insertOne(data);
            console.log(`${result.insertedId} is inserted`);

            out = result;
            res.status(201);
        } catch (err) {
            if (err.code == 11000)
                out = { error: data._id + ' is used by other.' };
            else
                out = { error: err.message };
            res.status(400);
        }

        res.send(out);
    };
}

exports.update = function (name) {
    return async function (req, res) {
        let out;
        let data = req.query;
        try {
            const db = await mongoPool.getDb();
            const collection = db.collection(name);
            let { result } = await collection.updateOne({ _id: req.params.id }, { $set: data });
            console.log(`${req.params.id} is updated`);

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
}

exports.delete = function (name) {
    return async function (req, res) {
        let out;
        try {
            const db = await mongoPool.getDb();
            const collection = db.collection(name);
            let { result } = await collection.deleteOne({ _id: req.params.id });

            if (result.n > 0) {
                console.log(`${req.params.id} is deleted`);
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