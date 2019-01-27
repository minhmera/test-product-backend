// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');
// const config = require('../config/config');
// var path = require('path')
// aws.config.update({
//     // Your SECRET ACCESS KEY from AWS should go here,
//     // Never share it!
//     // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
//     //secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
//     secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
//     // Not working key, Your ACCESS KEY ID from AWS should go here,
//     // Never share it!
//     // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
//     accessKeyId: config.AWS_ACCESS_KEY_ID,
//     region: 'us-east-2' // region of your bucket
// });
//
// const s3 = new aws.S3();
// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'dongxanh',
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             let imageName = file.fieldname + path.extname(file.originalname)
//             console.log("imageName   ",imageName, "  path  ",path.extname(file.originalname))
//             cb(null, {fieldName: imageName});
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString() +  path.extname(file.originalname) )
//         }
//     })
// })
//
// module.exports = upload;


const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/config');

const s3Config = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    Bucket: "dongxanh"
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// this is just to test locally if multer is working fine.
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'src/api/media/profiles')
    },
    filename: (req, file, cb) => {
        cb(null,Date.now().toString() + '-' + file.originalname)
    }
})

const multerS3Config = multerS3({
    s3: s3Config,
    bucket: "dongxanh",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, callback) {
        var newFileName = Date.now() + "-" + file.originalname;
        var fullPath = 'user_upload/images/'+ newFileName;
        console.log(" fullPath  ==>  ", fullPath)
        callback(null, fullPath);
        //callback(null, Date.now().toString() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
})

module.exports = upload;