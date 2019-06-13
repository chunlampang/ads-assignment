const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//a) Find the titles of courses offered by the CS department in 2016.
//b) List the information of courses offered by the CS or IS departments in 2016.
//c) Find the information of the course which is the most popular course enrolled by students.
//d) List the numbers of students for each course, who have enrolled the course offered by the CS department in 2016.
//e) List the courses offered by the CS department that the student Chan Tai Man has enrolled in 2016.

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});