const express = require('express');

const api = module.exports = express.Router({ mergeParams: true });

//a) Find the titles of courses offered by the CS department in 2016.
api.get('/a', function (req, res) {
    let { year, department } = req.query;
    res.send({
        courses: 'courses'
    });
});

//b) List the information of courses offered by the CS or IS departments in 2016.
api.get('/b', function (req, res) {
    let { year, departments } = req.query;
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