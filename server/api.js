const express = require('express');
const dbHelper = require('./dbHelper');

const api = module.exports = express.Router({ mergeParams: true });

//a) Find the titles of courses offered by the CS department in 2016.
api.get('/a', async function (req, res) {
    let { filter: { year, department }, sort } = req.query;

    const db = await dbHelper.connect();

    let data = await db.collection('offer').find({ year, department }, {
        skip: 1, limit: 1,
        fields: {
            department: true, course: true, year: true
        }, sort: dbHelper.parseSort(sort)
    })

    db.close();

    res.send({
        data
    });

});

//b) List the information of courses offered by the CS or IS departments in 2016.
api.get('/b', function (req, res) {
    let { year, departments } = req.query;

    const db = await dbHelper.connect();

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

    db.close();

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