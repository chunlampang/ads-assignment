const express = require('express');
const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');

const router = express.Router();
const route = router.route('/departments');

const collectionName = 'departments';

route.get(async function (req, res) {
    let out;
    try {
        let options = [];
        //join
        let join = queryHelper.parseArray('join', req.query.join || []);
        if (join.includes('offers')) {
            options.push({
                $lookup: {
                    from: 'offers',
                    localField: '_id',
                    foreignField: 'department',
                    as: '_join.offers'
                }
            });
        }

        const db = await mongoPool.getDb();
        const departments = db.collection(collectionName);
        out = await queryHelper.aggregateList(departments, options, req.query);
    } catch (err) {
        out = { error: err.message };
        res.status(400);
    }

    res.send(out);
});

module.exports = router;