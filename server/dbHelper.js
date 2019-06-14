const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

exports.connect = function(){
    return MongoClient.connect(config.db.url, { useNewUrlParser: true });
}

exports.parseSort = function(sort){
    return [['field1', 'asc'], ['field2', 'desc']];
}