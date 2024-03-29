const MongoClient = require('mongodb').MongoClient;

const configs = require.main.require('./configs');

class MongoPool {
    constructor(config) {
        this.mongoClient = null;
        this.db = null;
        this.config = config;
    }

    async connect() {
        console.log(`Connecting to ${this.config.url}`);
        this.mongoClient = await MongoClient.connect(this.config.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: this.config.poolSize
        });
        this.db = this.mongoClient.db(this.config.name);
    }

    async getDb() {
        if (!this.mongoClient || !this.mongoClient.isConnected()) {
            await this.connect();
        }
        return this.db;
    }
}

module.exports = new MongoPool(configs.db);