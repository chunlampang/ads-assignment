const mongoPool = require.main.require('./utils/mongoPool');
const queryReader = require.main.require('./utils/queryReader');

module.exports = function (api) {
    const route = api.route('/departments');

    route.get(async function (req, res) {
        let out = {};

        try {
            let queryFilter = {};

            const db = await mongoPool.getDb();
            const departments = db.collection('departments');

            let found = departments.find(queryFilter);

            let count = await found.count();
            let data = await queryReader
                .appendOptions(found, req.query)
                .toArray();

            out = {
                meta: { count },
                data
            };
        } catch (err) {
            out.error = err.message;
            res.status(400);
        }

        res.send(out);
    });
}
