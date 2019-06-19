module.exports = [
    {
        department: 'CS', course: 'CS101', year: 2016,
        classSize: 40, availablePlaces: 38, enrolledCount: 2,
        enrolled: [
            { student: '15101010', enrolDate: new Date('2016-05-15') },
            { student: '15101011', enrolDate: new Date('2016-05-16') },
        ]
    },
    {
        department: 'CS', course: 'CS102', year: 2016,
        classSize: 30, availablePlaces: 29, enrolledCount: 1,
        enrolled: [
            { student: '15101010', enrolDate: new Date('2016-05-15') },
        ]
    },
    {
        department: 'CS', course: 'CS102', year: 2017,
        classSize: 30, availablePlaces: 30, enrolledCount: 0,
        enrolled: []
    }
]