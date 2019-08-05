const express = require('express');
const queryHelper = require.main.require('./utils/queryHelper');
const Controller = require('../Controller');

const entity = require.main.require('./configs/course');
const controller = new Controller(entity);

const router = express.Router();
const route = router.route(`/${entity.collection}`);
const itemRouter = router.route(`/${entity.collection}/:id`);

route.get((req, res) => controller.query(req, res, (query, options) => {
    let join = queryHelper.parseArray('join', query.join);
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
}));
route.post((req, res) => controller.insert(req, res));
itemRouter.get((req, res) => controller.get(req, res));
itemRouter.put((req, res) => controller.update(req, res));
itemRouter.delete((req, res) => controller.delete(req, res));

module.exports = router;