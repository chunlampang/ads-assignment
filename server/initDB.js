
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

module.exports = async function initDB() {
  try {
    const db = await MongoClient.connect(url);
    const dbo = db.db("adsdb");

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