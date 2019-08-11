const express = require('express');
const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');
const Controller = require('../Controller');

const entity = require.main.require('./configs/department');
const controller = new Controller(entity);

const router = express.Router();
const route = router.route(`/${entity.collection}`);
const itemRouter = router.route(`/${entity.collection}/:id`);
const optionsRouter = router.route(`/${entity.collection}-string-options`);

route.get((req, res) => controller.query(req, res, (query, options) => {
    let join = queryHelper.parseArray('join', query.join);
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
}));
route.post((req, res) => controller.insert(req, res));
itemRouter.get((req, res) => controller.get(req, res));
itemRouter.put((req, res) => controller.update(req, res));
itemRouter.delete((req, res) => controller.delete(req, res));
optionsRouter.get((req, res) => controller.queryStringOptions(req, res));

module.exports = router;