const express = require('express');

const router = express.Router();

const sellingPosts = require('../models/selling_post');
const Users = require('../models/user');
const moment = require('moment');
const POINT_PER_POST = 0
const POINT_PER_EDIT = 0


router.post('/getByFullName', function (req, res, next) {

    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    //let filterOpt = {$regex: req.query.productName, $options: 'i'};

    Users.findOne({'local.fullName': req.body.fullName}, function (err, user) {
        if (user) {
            let filterOpt = {userId: {$regex: user._id, $options: 'i'},"isApprove": true}
            console.log('getByFullName req ==> ', user)
            sellingPosts
                .find(filterOpt)
                .skip(skip)
                .limit(size)
                .sort({createDate: -1})
                .exec((err, products) => {
                    sellingPosts.countDocuments(filterOpt,(err, count) => {
                        console.log('All Page ==>  count ', count)
                        if (err) return next(err);
                        res.json({result: products,totalCount: count});
                    });
                })
        } else {
            res.json({errorMessage: "Không có tên bán hàng này"});
        }
    })


});


module.exports = router;
