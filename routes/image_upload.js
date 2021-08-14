var express = require('express');
var router = express.Router();
const upload = require('../services/image_upload');
const config = require('../config/config');
const singleUpload = upload.single('image')

const multipleUpload = upload.array("images",3)

router.post('/', function(req, res) {
    console.log(' ******  Upload image  ',config.AWS_ACCESS_KEY_ID, "AWS_SECRET_ACCESS_KEY  ==> ",config.AWS_SECRET_ACCESS_KEY)

    // singleUpload(req, res, function(err, some) {
    //     console.log("singleUpload   req.file  ==>  ",req.file)
    //     if (err) {
    //         return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
    //     }

    //     return res.json({'imageUrl': req.file.location});
    // });

    //console.log('Image Upload ==>  ',req)

    multipleUpload(req, res, function(err, some) {
        //console.log("multipleUpload   ==>  req",req.files)
        console.log("multipleUpload   ==>  req",req)
        let imagesReq = []
        if (err) {
            return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
        }

        if(req.files){
            req.files.map((item,index)=>{
                //console.log(" item ==>  ", item)
                imagesReq.push(item.location)
            })
        }
        //console.log(" res  :==>  ",imagesReq)
        return res.json({'imageUrls': imagesReq});
    });
})

module.exports = router;
