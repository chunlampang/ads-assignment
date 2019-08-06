module.exports = {
    entities: {
        department: require('./department'),
        student: require('./student'),
        offer: require('./offer'),
    },
    fieldsets: {
        course: require('./course'),
    }
}