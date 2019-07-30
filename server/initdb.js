
const mongoPool = require('./utils/mongoPool');

(async function () {
    try {
        const db = await mongoPool.getDb();
        console.log('Reseting database');
        await db.dropDatabase();

        async function insert(collectionName, data, created) {
            let collection = await db.createCollection(collectionName);
            console.log(`Created collection: ${collectionName}`);
            if (created)
                await created(collection);//for create indexs
            //insert data
            let result = await collection.insertMany(data, { w: 1 });
            for (let i = 0; i < data.length; i++) {
                data[i]._id = result.insertedIds[i];
            }

            if (result.ok)
                console.log(`Inserted ${collectionName} data`);
            return data;
        }

        let data = await Promise.all([
            insert('departments', require('./data/departments.data')),
            insert('courses', require('./data/courses.data')),
            insert('students', require('./data/students.data'), collection => {
                collection.createIndex({ stuName: 1 });
            }),
        ]);
        
        await insert('offers', require('./data/offers.data')(data[0], data[1], data[2]), collection => {
            collection.createIndex({ department: 1, course: 1, year: 1 }, { unique: true });
            collection.createIndex({ enrolledCount: 1 });
        });

        console.log('All Completed');
    } catch (err) {
        console.error(err.message);
    } finally {
        process.exit();
    }
})();