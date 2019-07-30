const express = require('express');
const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');
const common = require('../common');

const collectionName = 'courses';

const router = express.Router();
const route = router.route(`/${collectionName}`);
const itemRouter = router.route(`/${collectionName}/:id`);

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
                    foreignField: 'course',
                    as: '_join.offers'
                }
            });
        }

        const db = await mongoPool.getDb();
        const courses = db.collection('courses');
        out = await queryHelper.aggregateList(courses, options, req.query);
    } catch (err) {
        out = { error: err.message };
        res.status(400);
    }

    res.send(out);
});

route.post(common.insert(collectionName));
itemRouter.get(common.get(collectionName));
itemRouter.put(common.update(collectionName));
itemRouter.delete(common.delete(collectionName));

module.exports = router;