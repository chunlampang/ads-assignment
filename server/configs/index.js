module.exports = {
    db: {
        url: "mongodb://localhost:27017",
        name: "adsdb",
        poolSize: 20
    },
    server: {
        port: 8082
    },
    entities: {
        department: require('./department'),
        student: require('./student'),
        offer: require('./offer'),
    },
    fieldsets: {
        course: require('./course'),
    }
}