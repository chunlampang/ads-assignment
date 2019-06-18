
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
            let res = await collection.insertMany(data, { w: 1 });
            if (res.result.ok)
                console.log(`Inserted ${collectionName} data`);
            return res;
        }

        await Promise.all([
            insert('departments', require('./data/departments.data')),
            insert('courses', require('./data/courses.data')),
            insert('students', require('./data/students.data'), collection => {
                collection.createIndex({ stuName: 1 });
            }),
            insert('offers', require('./data/offers.data'), collection => {
                collection.createIndex({ year: 1, department: 1 });
            }),
        ]);
        console.log('All Completed');
    } catch (err) {
        console.error(err.message);
    } finally {
        process.exit();
    }
})();