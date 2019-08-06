module.exports = function (departments, courses, students) {

    const classSize = [20, 30, 40];

    const offers = [];
    for (let year = 2010; year <= 2018; year++) {
        for (let course of courses) {
            if (Math.random() < 0.05)// 5% skip course'
                continue;

            let offer = {
                department: getRandomItem(departments)._id,
                course: course,
                year: year,
                classSize: getRandomItem(classSize),
                enrolled: []
            }

            for (let student of students) {
                if (offer.enrolled.length >= offer.classSize)
                    break;
                if (Math.random() < 0.7)
                    continue;
                if (offer.enrolled.length > (offer.classSize * 0.6) && Math.random() < 0.1)
                    break;

                offer.enrolled.push({
                    student: student._id,
                    enrolDate: new Date(`${year}-05-${parseInt(Math.random() * 29) + 1}`)
                });
            }
            offer.enrolledCount = offer.enrolled.length;
            offer.availablePlaces = offer.classSize - offer.enrolledCount;
            offers.push(offer);
        }

    }
    return offers;
}

function getRandomItem(array) {
    return array[parseInt(Math.random() * array.length)];
}