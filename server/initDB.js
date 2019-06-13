
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

module.exports = async function initDB() {
  try {
    const db = await MongoClient.connect(url);
    const dbo = db.db("adsdb");

    if (!dbo.getCollection('Offer').exists())
      await dbo.createCollection("Offer");
    await dbo.getCollection('Offer').ensureIndex("Year");

    db.close();
  } catch (err) {
    console.log(err);
  }
};