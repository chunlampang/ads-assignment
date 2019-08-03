const express = require('express');
const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');
const Controller = require('../Controller');
const { ObjectId } = require('mongodb');

const entity = require.main.require('./entities/offer');
const controller = new Controller(entity);

const router = express.Router();
const route = router.route(`/${entity.collection}`);
const itemRouter = router.route(`/${entity.collection}/:id`);

//a) Find the titles of courses offered by the CS department in 2016.
//b) List the information of courses offered by the CS or IS departments in 2016.
//c) Find the information of the course which is the most popular course enrolled by students.
//d) List the numbers of students for each course, who have enrolled the course offered by the CS department in 2016.
//e) List the courses offered by the CS department that the student Chan Tai Man has enrolled in 2016.
route.get(async function (req, res) {
    let out;
    try {
        let options = [];
        //filter
        let filter = req.query.filter || {};
        if (filter.year) {
            options.push({
                $match: {
                    year: {
                        $eq: queryHelper.parsePositiveInteger('year', filter.year)
                    }
                }
            });
        }
        if (filter.department) {
            let departments = queryHelper.parseArray('department', filter.department);
            let deptIds = [];
            for (let dept of departments) {
                deptIds.push(ObjectId(dept));
            }
            options.push({
                $match: {
                    department: {
                        $in: deptIds
                    }
                }
            });
        }
        if (filter.student) {
            options.push({
                $match: {
                    'enrolled.student': {
                        $eq: queryHelper.parseString('student', filter.student)
                    }
                }
            });
        }

        //join
        let join = queryHelper.parseArray('join', req.query.join || []);
        if (join.includes('course')) {
            options.push(
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'course',
                        foreignField: '_id',
                        as: '_join.course'
                    }
                },
                { $unwind: '$_join.course' }
            );
        }
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
                { $unwind: '$_join.department' }
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

        const db = await mongoPool.getDb();
        const offers = db.collection(entity.collection);
        out = await queryHelper.aggregateList(offers, options, req.query);
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