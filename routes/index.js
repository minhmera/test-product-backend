var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(' index  ==>  req',req)
  res.render('index', { title: 'Product' });
});

module.exports = router;
