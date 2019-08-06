
const mongoPool = require('./utils/mongoPool');

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

        let departments = require('./data/departments.data');
        let courses = require('./data/courses.data');
        let students = require('./data/students.data');

        appendCourseToDepartments(departments, courses);

        await insert('departments', departments);
        await insert('students', students);
        await insert('offers', require('./data/offers.data')(departments, courses, students));

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

        for (let course of courses) {
            for (let department of departments) {
                if (!department.courses)
                    department.courses = [];
                else if (department.courses.length > 5)
                    continue;
                if (Math.random() < 0.2)
                    continue;

                department.courses.push(course);
            }
        }
    }
})();