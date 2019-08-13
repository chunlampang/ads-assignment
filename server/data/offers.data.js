exports.genRecord = function (seed, departments, students) {
    function getRandomItem(array) {
        return array[parseInt(seed.random() * array.length)];
    }

    const classSize = [20, 30, 30, 30, 40, 60, 80];

    const offers = [];
    for (let year = 2012; year <= 2018; year++) {

        for (let department of departments) {
            for (let { course } of department.courses) {
                if (seed.random() < 0.05)// 5% skip course'
                    continue;

                let offer = {
                    department: department._id,
                    course: course,
                    year: year,
                    classSize: getRandomItem(classSize),
                    enrolled: []
                }

                for (let student of students) {
                    if (!student.enrolled) {
                        student.enrolled = {};
                        student.eC = 0;
                    }
                    if (student.eC >= 30)
                        continue;
                    if (student.enrolled[year] > 10)
                        continue;
                    if (offer.enrolled.length >= offer.classSize)
                        break;
                    if (seed.random() < 0.7)
                        continue;
                    if (offer.enrolled.length > (offer.classSize * 0.6) && seed.random() < 0.1)
                        break;

                    if (!student.enrolled[year]) {
                        student.enrolled[year] = 0;
                    }
                    student.enrolled[year]++;
                    student.eC++;

                    offer.enrolled.push({
                        student: student._id,
                        enrolDate: new Date(`${year}-05-${parseInt(seed.random() * 29) + 1}`)
                    });
                }
                offer.enrolledCount = offer.enrolled.length;
                offer.availablePlaces = offer.classSize - offer.enrolledCount;
                offers.push(offer);
            }

        }

    }


    return offers;
}
