/*
a) Find the titles of courses offered by the CS department in 2016.
b) List the information of courses offered by the CS or IS departments in 2016.
c) Find the information of the course which is the most popular course enrolled
by students.
d) List the numbers of students for each course, who have enrolled the course
offered by the CS department in 2016.
e) List the courses offered by the CS department that the student Chan Tai Man
has enrolled in 2016.
 */
db = {
    Departments: [
        { DeptID: 'CS', DeptName: 'Computer Science', Location: 'Green Zone' }
    ],
    Courses: [
        { CourseID: 'CS101', Title: 'Introduction to Data Science', Level: 6 }
    ],
    Offer: [
        { DeptID: 'CS', CourseID: 'CS101', Year: 2016, ClassSize: 40, AvailablePlaces: 40 }
    ],
    Students: [
        { StudentID: '15101010', StuName: 'Chan Tai Man', DOB: '10/08/2009' }
    ],
    Enrolled: [
        { StudentID: '15101010', Year: 2016, CourseID: 'CS101', EnrolDate: '15/05/2016' }
    ],
};

/*
Model 1
Better preformance when search by student (e)
no data redundancy
*/
db = {
    Departments: [
        { DeptID: 'CS', DeptName: 'Computer Science', Location: 'Green Zone' }
    ],
    Courses: [
        { CourseID: 'CS101', Title: 'Introduction to Data Science', Level: 6 }
    ],
    Offer: [
        { DeptID: 'CS', CourseID: 'CS101', Year: 2016, ClassSize: 40, AvailablePlaces: 40 }
    ],
    Students: [
        {
            StudentID: '15101010', StuName: 'Chan Tai Man', DOB: '10/08/2009',
            Enrolled: [
                {
                    StudentID: '15101010', Year: 2016,
                    CourseID: 'CS101', EnrolDate: '15/05/2016'
                }
            ]
        }
    ],
};

/*
Model 2
Better preformance when search by offer (a,b,c,d)
no data redundancy

Data Consistency (for update AvailablePlaces when enroll)
(Offer and Enrolled in same document -> allow transaction)
*/
db = {
    departments: [
        { _id: 'CS', deptName: 'Computer Science', location: 'Green Zone' }
    ],
    courses: [
        { _id: 'CS101', title: 'Introduction to Data Science', level: 6 }
    ],
    offers: [
        {
            department: 'CS', course: 'CS101', year: 2016,
            classSize: 40, availablePlaces: 39, enrolledCount: 1,
            enrolled: [
                { student: '15101010', enrolDate: '15/05/2016' }
            ]
        }
    ],
    students: [
        { _id: '15101010', stuName: 'Chan Tai Man', dOB: '10/08/2009' }
    ],
};
/*
Model 2,
1. It is more cases to search by offer then by student.
2. Data Consistency:
model1 store offer and enrolled in different document -> cannot do transaction
*/