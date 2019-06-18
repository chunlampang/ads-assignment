const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');

module.exports = function (api) {
    const route = api.route('/departments');

    route.get(async function (req, res) {
        let out;
        try {
            const db = await mongoPool.getDb();
            const departments = db.collection('departments');
            out = await queryHelper.aggregateList(departments, [], req.query);
        } catch (err) {
            out = { error: err.message };
            res.status(400);
        }

        res.send(out);
    });
}
