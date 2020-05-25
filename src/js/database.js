const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/mydb';

exports.CreateConnection = function () {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mydb');
    dbo.createCollection('content', function (err, res) {
      if (err) throw err;
      console.log('Collection content erstellt');
      db.close();
    });
    console.log('Datenbank erstellt');
  });
};
