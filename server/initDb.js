
const mongoPool = require('./utils/mongoPool');

(async function () {
    try {
        const db = await mongoPool.getDb();

        async function insert(collectionName, data) {
            console.log(`Start inserting ${collectionName} data`);
            let collection = await db.createCollection(collectionName);
            let result = await collection.insertMany(data, { w: 1 });
            console.log(result);
            return result;
        }

        await Promise.all([
            insert('departments', require('./data/departments.data')),
            insert('courses', require('./data/courses.data')),
            insert('students', require('./data/students.data')),
            insert('offers', require('./data/offers.data')),
        ]);
    } catch (err) {
        console.error(err.message);
    } finally {
        process.exit();
    }
})();