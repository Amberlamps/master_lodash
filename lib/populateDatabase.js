/**
 * Populate database with lodash functions.
 */


'use strict';


/**
 * MODULES.
 */
var Promise = require('bluebird');
var debug = require('debug')('master_lodash');
var MongoClient = require('mongodb').MongoClient;
var cheerio = require('cheerio');
var request = require('request');
var getDatabase = require('./getDatabase.js');
var shortid = require('shortid').seed(2783);


/**
 * FUNCTIONS.
 */
function populateDatabase(config) {

  config = config || {};
  config.mongodb = config.mongodb || 'mongodb://localhost:27017/master_lodash';
  config.lodashUrl = config.lodashUrl || 'https://lodash.com/docs';

  return getDatabase(config.mongodb)
  .then(prepareCollection)
  .then(function (db) {
    return scrapeLodashWebsite(config.lodashUrl)
    .then(buildLodashDocuments)
    .then(createLodashDocuments(db))
    .then(function () {
      db.close();
      return 'database created';
    });
  });

}

function buildLodashDocuments(body) {
  return new Promise(function (resolve, reject) {
    var $ = cheerio.load(body);
    var docs = [];
    $("pre").each(function (i, element) {
      var _element = $(this);
      var _name = _element.find('.me1').first().text();
      _element.find('.me1:contains("' + _name + '")').replaceWith('<span class="me1">FUNCTION</span>');
      docs[docs.length] = {
        _id: shortid.generate(),
        html: _element.html(),
        name: _name
      };
    });
    return resolve(docs);
  });
}

function createLodashDocuments(db) {
  return function _createLodashDocuments(docs) {
    return new Promise(function (resolve, reject) {
      var collection = db.collection('master_lodash');
      collection.insertMany(docs, function (err, results) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  };
}

function scrapeLodashWebsite(url) {
  return new Promise(function (resolve, reject) {
    request({
      url: url
    }, function (err, response, body) {
      if (err) {
        return reject(err);
      }
      if (response.statusCode !== 200) {
        return reject(new Error('Could not scrape lodash website. Status code: ' + response.statusCode));
      }
      return resolve(body);
    });
  });
}

function prepareCollection(db) {
  return new Promise(function (resolve, reject) {
    var collection = db.collection('master_lodash');
    collection.deleteMany();
    return resolve(db);
  });
}

var config = {
  mongodb: 'mongodb://localhost:27017/master_lodash',
  lodashUrl: 'https://lodash.com/docs'
};

populateDatabase(config)
.then(function (message) {
  debug(message);
})
.catch(function (err) {
  debug('caught error');
  throw err;
});


/**
 * EXPORTS.
 */
module.exports = populateDatabase;