const mongoPool = require.main.require('./utils/mongoPool');
const queryHelper = require.main.require('./utils/queryHelper');

module.exports = function (api) {
    const route = api.route('/offers');
    //a) Find the titles of courses offered by the CS department in 2016.
    //b) List the information of courses offered by the CS or IS departments in 2016.
    //c) Find the information of the course which is the most popular course enrolled by students.
    //d) List the numbers of students for each course, who have enrolled the course offered by the CS department in 2016.
    //e) List the courses offered by the CS department that the student Chan Tai Man has enrolled in 2016.
    route.get(async function (req, res) {
        let out;
        try {
            const db = await mongoPool.getDb();
            const offers = db.collection('offers');

            let filter = req.query.filter || {};

            let queryFilter = {};
            if (filter.year) {
                queryFilter.year = {
                    $eq: queryHelper.parseInteger('year', filter.year)
                };
            }
            if (filter.department) {
                queryFilter.department = {
                    $in: queryHelper.parseArray('department', filter.department)
                };
            }

            let include = queryHelper.parseArray('include', req.query.include || []);

            let options = [];
            if (include.includes('course')) {
                options.push({
                    $lookup: {
                        from: 'courses',
                        localField: 'course',
                        foreignField: '_id',
                        as: 'course'
                    }
                });
                options.push({
                    $unwind: "$course"
                });
            }
            if (include.includes('department')) {
                options.push({
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department'
                    }
                });
                options.push({
                    $unwind: "$department"
                });
            }
            if (include.includes('enrolled.student')) {
                options.push({
                    $lookup: {
                        from: 'students',
                        localField: 'enrolled.student',
                        foreignField: '_id',
                        as: 'in.student'
                    }
                });

                if (filter.student) {

                }
            }

            options.push({
                $match: queryFilter
            });

            out = await queryHelper.aggregateList(offers, options, req.query);
        } catch (err) {
            out = { error: err.message };
            res.status(400);
        }

        res.header("Content-Type", 'application/json')
            .send(JSON.stringify(out, null, 2));
    });
}