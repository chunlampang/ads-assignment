const express = require('express');
const queryHelper = require.main.require('./utils/queryHelper');
const Controller = require('../Controller');

const entity = require.main.require('./configs/offer');
const controller = new Controller(entity);

const router = express.Router();
const route = router.route(`/${entity.collection}`);
const itemRouter = router.route(`/${entity.collection}/:id`);
const optionsRouter = router.route(`/${entity.collection}-string-options`);

route.get((req, res) => controller.query(req, res, (query, options) => {
    let join = queryHelper.parseArray('join', query.join);
    if (join.includes('department')) {
        options.push(
            {
                $lookup: {
                    from: 'departments',
                    localField: 'department',
                    foreignField: '_id',
                    as: '_join.department'
                }
            },
            {
                $unwind: {
                    path: '$_join.department',
                    preserveNullAndEmptyArrays: true
                }
            }
        );
    }
    if (join.includes('students')) {
        options.push({
            $lookup: {
                from: 'students',
                localField: 'enrolled.student',
                foreignField: '_id',
                as: '_join.students'
            }
        });

        if (filter.stuName) {
            options.push({
                $match: {
                    '_join.students': {
                        $elemMatch: {
                            stuName: new RegExp(queryHelper.parseString('stuName', filter.stuName), 'i')
                        }
                    }
                }
            });
        }
    }
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
}));
route.post((req, res) => controller.insert(req, res));
itemRouter.get((req, res) => controller.get(req, res));
itemRouter.put((req, res) => controller.update(req, res));
itemRouter.delete((req, res) => controller.delete(req, res));
optionsRouter.get((req, res) => controller.queryStringOptions(req, res));

module.exports = router;