var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var debug = require('debug')('getDatabase');

function getDatabase(mongodbConfig) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(mongodbConfig, function (err, db) {
      if (err) {
        return reject(err);
      }
      debug('connected to mongodb');
      return resolve(db);
    });
  });
}

module.exports = getDatabase;