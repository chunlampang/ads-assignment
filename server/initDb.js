
const mongoPool = require('./utils/mongoPool');

(async function () {
    const db = await mongoPool.getDb();

    async function insert(collectionName, data) {
        console.log(`Inserting ${collectionName} data`)
        let collection = await db.createCollection(collectionName);
        let result = await collection.insertMany(data, { w: 1 });
        console.log(result);
        return result;
    }

    let promises = [
        insert('departments', [
            { _id: 'CS', deptName: 'Computer Science', location: 'Green Zone' }
        ]),

        insert('courses', [
            { _id: 'CS101', title: 'Introduction to Data Science', level: 6 }
        ]),

        insert('students', [
            { _id: '15101010', stuName: 'Chan Tai Man', dOB: '10/08/2009' }
        ]),

        insert('offer', [
            {
                department: 'CS', course: 'CS101', year: 2016,
                classSize: 40, availablePlaces: 40,
                enrolled: [
                    { student: '15101010', enrolDate: '15/05/2016' }
                ]
            }
        ]),
    ];

    await Promise.all(promises);


    process.exit();
})();