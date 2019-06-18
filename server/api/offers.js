const mongoPool = require.main.require('./utils/mongoPool');
const queryReader = require.main.require('./utils/queryReader');

module.exports = function (api) {
    const route = api.route('/offers');
    //a) Find the titles of courses offered by the CS department in 2016.
    //b) List the information of courses offered by the CS or IS departments in 2016.
    //c) Find the information of the course which is the most popular course enrolled by students.
    //d) List the numbers of students for each course, who have enrolled the course offered by the CS department in 2016.
    //e) List the courses offered by the CS department that the student Chan Tai Man has enrolled in 2016.
    route.get(async function (req, res) {
        let out = {};

        try {
            const db = await mongoPool.getDb();
            const offers = db.collection('offers');

            let filter = req.query.filter || {};

            let queryFilter = {};
            if (filter.year) {
                queryFilter.year = {
                    $eq: queryReader.parseInteger('year', filter.year)
                };
            }
            if (filter.department) {
                queryFilter.department = {
                    $in: queryReader.parseArray('department', filter.department)
                };
            }

            let include = queryReader.parseArray('include', req.query.include || []);

            let join = [];
            if (include.includes('course')) {
                join.push({
                    $lookup: {
                        from: 'courses',
                        localField: 'course',
                        foreignField: '_id',
                        as: 'course'
                    }
                });
                join.push({
                    $unwind: "$course"
                });
            }
            if (include.includes('department')) {
                join.push({
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department'
                    }
                });
                join.push({
                    $unwind: "$departments"
                });
            }
            if (include.includes('student')) {
                join.push({
                    $lookup: {
                        from: 'students',
                        localField: 'enrolled.student',
                        foreignField: '_id',
                        as: 'enrolled.student'
                    }
                });
                join.push({
                    $unwind: "$enrolled.student"
                });

                if (filter.student) {

                }
            }

            let aggregate = offers.aggregate(join);

            //let count = await aggregate.count();
            let data = await queryReader
                .appendOptions(aggregate, req.query)
                .toArray();

            out = {
                //meta: { count },
                data
            };
        } catch (err) {
            out.error = err.message;
            res.status(400);
        }

        res.header("Content-Type", 'application/json')
            .send(JSON.stringify(out, null, 2));
    });
}