var express = require('express');
var router = express.Router();
let locationVNData = require('../resource/location-vn.json');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
    //console.log('locationVNData  ==> ', locationVNData)
    res.json({result:locationVNData})
});

module.exports = router;
