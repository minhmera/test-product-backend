var express = require('express');
var router = express.Router();

/* GET /todos listing. */
router.get('/appInfo', function (req, res, next) {
    let appInfo = {
        latestVersionIOS: '1.0',
        latestVersionAndroid: '1.0',
        appStoreUrl: 'https://apps.apple.com/us/app/facebook/id284882215',
        chPlayUrl: 'https://play.google.com/store/apps/details?id=com.facebook.katana&hl=en&gl=US',
        message: ''
    }
    res.json({appInfo})
});

module.exports = router;
