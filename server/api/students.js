const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');

module.exports = function (api) {
    const route = api.route('/students');

    route.get(async function (req, res) {
        let out;
        try {
            let options = [];
            //filter
            let filter = req.query.filter || {};
            if (filter._id) {
                options.push({
                    $match: {
                        _id: new RegExp(queryHelper.parseString('_id', filter._id), 'i')
                    }
                });
            }
            if (filter.stuName) {
                options.push({
                    $match: {
                        stuName: new RegExp(queryHelper.parseString('stuName', filter.stuName), 'i')
                    }
                });
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
            const students = db.collection('students');
            out = await queryHelper.aggregateList(students, options, req.query);
        } catch (err) {
            out = { error: err.message };
            res.status(400);
        }

        res.send(out);
    });
}
