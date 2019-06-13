
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

module.exports = async function initDB() {
  try {
    const db = await MongoClient.connect(config.db.url, { useNewUrlParser: true });
    const dbo = db.db(config.db.name);

    if (!dbo.getCollection('departments').exists())
      await dbo.createCollection("departments");

    if (!dbo.getCollection('courses').exists())
      await dbo.createCollection("courses");

    if (!dbo.getCollection('students').exists())
      await dbo.createCollection("students");

    if (!dbo.getCollection('offer').exists())
      await dbo.createCollection("offer");
    await dbo.getCollection('offer').ensureIndex("year");

    db.close();
  } catch (err) {
    console.log(err);
  }
};