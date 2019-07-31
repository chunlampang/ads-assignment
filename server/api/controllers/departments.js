const express = require('express');
const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');
const Controller = require('../Controller');

const entity = require.main.require('./entities/department');
const controller = new Controller(entity);

const router = express.Router();
const route = router.route(`/${entity.collection}`);
const itemRouter = router.route(`/${entity.collection}/:id`);

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
        const departments = db.collection(entity.collection);
        out = await queryHelper.aggregateList(departments, options, req.query);
    } catch (err) {
        out = { error: err.message };
        res.status(400);
    }

    res.send(out);
});

route.post((req, res) => controller.insert(req, res));
itemRouter.get((req, res) => controller.get(req, res));
itemRouter.put((req, res) => controller.update(req, res));
itemRouter.delete((req, res) => controller.delete(req, res));

module.exports = router;