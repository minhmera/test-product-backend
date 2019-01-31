var express = require('express');
var router = express.Router();
const upload = require('../services/image_upload');

const singleUpload = upload.single('image')

router.post('/', function(req, res) {
    console.log(' ******  Test upload image  ***** ')

    singleUpload(req, res, function(err, some) {
        if (err) {
            return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
        }

        return res.json({'imageUrl': req.file.location});
    });
})

module.exports = router;