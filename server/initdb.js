
const mongoPool = require('./utils/mongoPool');
const RandomSeed = require('./utils/RandomSeed');

(async function () {
    try {
        const db = await mongoPool.getDb();
        console.log('Reseting database');
        await db.dropDatabase();

        await createCollection('departments', collection => {
            collection.createIndex({ deptId: 1 }, { unique: true });
        });
        await createCollection('students');
        await createCollection('offers', collection => {
            collection.createIndex({ 'course.courseId': 1, year: 1 }, { unique: true });
        });

        let seed = new RandomSeed(8899);

        let departments = require('./data/departments.data');
        let courses = require('./data/courses.data');
        let students = require('./data/students.data').genRecord(seed);

        appendCourseToDepartments(departments, courses);

        await insert('departments', departments);
        await insert('students', students);
        await insert('offers', require('./data/offers.data').genRecord(seed, departments, courses, students));

        console.log('All Completed');

        async function createCollection(collectionName, created) {
            let collection = await db.createCollection(collectionName);
            console.log(`Created collection: ${collectionName}`);
            if (created)
                await created(collection);//for create indexs
        }

        async function insert(collectionName, data) {
            let collection = await db.collection(collectionName);
            let result = await collection.insertMany(data, { w: 1 });
            for (let i = 0; i < data.length; i++) {
                data[i]._id = result.insertedIds[i];
            }

            if (result.result.ok)
                console.log(`Inserted ${collectionName} data`);
        }

    } catch (err) {
        console.error(err.message);
    } finally {
        process.exit();
    }

    function appendCourseToDepartments(departments, courses) {
        let courseIndex = 0;
        for (let department of departments) {
            department.courses = [];

            for (let i = 0; i < 5; i++) {
                if (!courses[courseIndex])
                    break;

                department.courses.push({ course: courses[courseIndex++] });
            }
        }
    }
})();