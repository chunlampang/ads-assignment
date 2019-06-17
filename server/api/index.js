const express = require('express');
const mongoPool = require.main.require('./utils/mongoPool');
const queryReader = require.main.require('./utils/queryReader');

const api = module.exports = express.Router({ mergeParams: true });

//a) Find the titles of courses offered by the CS department in 2016.
api.get('/a', async function (req, res) {
    let out = {};

    try {
        let { year, department } = req.query.filter || {};

        let queryFilter = {};
        if (year) {
            queryFilter.year = {
                $eq: queryReader.parseInteger('year', year)
            };
        }
        if (department) {
            queryFilter.department = {
                $in: queryReader.parseArray('department', department)
            };
        }

        const db = await mongoPool.getDb();
        const offer = db.collection('offer');
        const courses = db.collection('courses');

        let found = offer.find(queryFilter);

        let count = await found.count();
        let data = await queryReader
            .appendOptions(found, req.query)
            .toArray();

        let promises = [];
        for (let item of data) {
            item._included = {};

            let course = item.course;
            promises.push(course ? courses.findOne({ _id: item.course }) : null);
        }

        let results = await Promise.all(promises);
        for (let i = 0; i < data.length; i++) {
            data[i]._included.course = results[i];
        }

        out = {
            meta: { count },
            data
        };
    } catch (err) {
        out.error = err.message;
        res.status(400);
    }

    res.header("Content-Type", 'application/json')
        .send(JSON.stringify(out, null, 2));
});

//b) List the information of courses offered by the CS or IS departments in 2016.
api.get('/b', function (req, res) {
    let { year, departments } = req.query;
    /*
        const db = await queryConverter.connect();
    
        let data = await db.collection('offer').find({
            year, department, $or: [
                { "fieldname": { $gte: 100 } }
            ]
        }, {
                skip: 1, limit: 1,
                fields: {
                    course: 1
                }, sort: [['field1', 'asc'], ['field2', 'desc']]
            })
            */

    res.send({
        courses: 'courses'
    });
});

//c) Find the information of the course which is the most popular course enrolled by students.
api.get('/c', function (req, res) {
    res.send({
        courses: 'courses'
    });
});

//d) List the numbers of students for each course, who have enrolled the course offered by the CS department in 2016.
api.get('/d', function (req, res) {
    let { year, department } = req.query;
    res.send({
        students: 'students'
    });
});

//e) List the courses offered by the CS department that the student Chan Tai Man has enrolled in 2016.
api.get('/e', function (req, res) {
    let { year, department, student } = req.query;
    res.send({
        courses: 'courses'
    });
});