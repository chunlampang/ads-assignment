
const mongoPool = require('./utils/mongoPool');

(async function () {
    const db = await mongoPool.getDb();

    async function insert(collectionName, data) {
        try {
            console.log(`Start inserting ${collectionName} data`);
            let collection = await db.createCollection(collectionName);
            let result = await collection.insertMany(data, { w: 1 });
            console.log(result);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    let promises = [
        insert('departments', [
            { _id: 'CS', deptName: 'Computer Science', location: 'Green Zone' }
        ]),

        insert('courses', [
            { _id: 'CS101', title: 'Introduction to Data Science', level: 6 },
            { _id: 'CS102', title: 'Introduction to Hello World', level: 3 }
        ]),

        insert('students', [
            { _id: '15101010', stuName: 'Chan Tai Man', dOB: new Date('2009-08-10') }
        ]),

        insert('offers', [
            {
                department: 'CS', course: 'CS101', year: 2016,
                classSize: 40, availablePlaces: 39,
                enrolled: [
                    { student: '15101010', enrolDate: new Date('2016-05-15') }
                ]
            },
            {
                department: 'CS', course: 'CS102', year: 2016,
                classSize: 40, availablePlaces: 39,
                enrolled: [
                    { student: '15101010', enrolDate: new Date('2016-05-15') }
                ]
            },
            {
                department: 'CS', course: 'CS102', year: 2017,
                classSize: 40, availablePlaces: 40,
                enrolled: []
            }
        ]),
    ];

    await Promise.all(promises);


    process.exit();
})();