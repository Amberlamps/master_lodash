var express = require('express');
var router = express.Router({
  mergeParams: true
});
var api = require('./api.js');

router.use('/api', api);

module.exports = router;