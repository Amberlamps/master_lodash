var express = require('express');
var router = express.Router();
var getDatabase = require('../../getDatabase.js')('mongodb://localhost:27017/master_lodash');
var debug = require('debug')('api');

router.get('/functions', getFunctions);
router.get('/functions/:functionId', getFunction);

function getFunctions(req, res, next) {
  return queryFunctionDocuments({})
  .then(function (docs) {
    return res.json({
      data: docs.map(function (doc) {
        return doc._id;
      })
    });
  })
  .catch(next);;
}

function getFunction(req, res, next) {
  var functionId = req.params.functionId;
  return queryFunctionDocuments({ _id: functionId })
  .then(function (docs) {
    var doc = docs[0];
    if (!doc) {
      var error = new Error('No function document found with ID ' + functionId);
      error.status = 404;
      throw error;
    }
    return res.json({
      name: doc.name,
      html: doc.html
    });
  })
  .catch(next);;
}

function queryFunctionDocuments(selector) {
  return getDatabase
  .then(getFunctionDocuments(selector));
}

function getFunctionDocuments(selector) {
  return function _getFunctionDocuments(db) {
    return new Promise(function (resolve, reject) {
      var collection = db.collection('master_lodash');
      collection.find(selector).toArray(function (err, docs) {
        if (err) {
          return reject(err);
        }
        return resolve(docs || []);
      });
    });
  };
}

module.exports = router;