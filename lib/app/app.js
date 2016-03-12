/**
 * master_lodash app.
 */


/**
 * MODULES.
 */
var express = require('express');
var app = express();
var router = require('./router/index.js');

/**
 **/

app.use('/', router);

app.listen(3030, function () {
  console.log('master_lodash running on 3000');
});