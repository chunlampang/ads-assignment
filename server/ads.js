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
fastest searching for the five requiremnts
(without joining from other document)
(Department,Course,Student information not always update)

Offer and Enrolled in same document
(allow transaction)
(for update class size when enroll)
*/
db = {
    Offer: [
        {
            Department: {
                DeptID: 'CS', DeptName: 'Computer Science', Location: 'Green Zone'
            },
            Course: {
                CourseID: 'CS101', Title: 'Introduction to Data Science', Level: 6
            },
            Year: 2016, ClassSize: 40, AvailablePlaces: 40,
            Enrolled: [
                {
                    Student: {
                        StudentID: '15101010', StuName: 'Chan Tai Man', DOB: '10/08/2009'
                    },
                    EnrolDate: '15/05/2016'
                }
            ],
        }
    ]
};

/*
no data redundancy 
(slow when joining other info when searching offer)

Offer and Enrolled in same document
(allow transaction)
(for update class size when enroll)
*/
db = {
    Departments: [
        { DeptID: 'CS', DeptName: 'Computer Science', Location: 'Green Zone' }
    ],
    Courses: [
        { CourseID: 'CS101', Title: 'Introduction to Data Science', Level: 6 }
    ],
    Offer: [
        {
            DeptID: 'CS', CourseID: 'CS101', Year: 2016,
            ClassSize: 40, AvailablePlaces: 40,
            Enrolled: [
                { StudentID: '15101010', EnrolDate: '15/05/2016' }
            ]
        }
    ],
    Students: [
        { StudentID: '15101010', StuName: 'Chan Tai Man', DOB: '10/08/2009' }
    ],
};