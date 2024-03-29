const express = require('express');

const router = express.Router();

const sellingPosts = require('../models/selling_post');
const Users = require('../models/user');
const moment = require('moment');
const POINT_PER_POST = 0
const POINT_PER_EDIT = 0

/* GET /todos listing. */
router.get('/getAll', (req, res, next) => {
    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    let filterOpt = { "isApprove": true }
    sellingPosts
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .select("-userId")
        .exec((err, products) => {
            sellingPosts.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products,totalCount: count});
            });
        });

});

router.get('/getAllADMIN', (req, res, next) => {
    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;
    //let filterOpt = { "isApprove": req.query.status }
    let filterOpt = { "isApprove": false }
    console.log('getAllADMIN  ==>   ',filterOpt)
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
        });

});


router.get('/getByCategory', function (req, res, next) {
    console.log('query   ===>   ', req.query)
    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    let filterOpt = {
        "categoryId": req.query.categoryId,
        "isApprove": true
    }
    if (req.query.provinceId) {
        filterOpt.provinceId = req.query.provinceId
    }
    let dateString = Date.now()
    let formatString = 'DD-MM-YYYY'
    let timeString = ""
    let time = moment(dateString).format(formatString)
    //timeString = time.replace(':','H')

    console.log( 'timeString ==>  ',time)


    sellingPosts
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .select("-userId")
        .exec((err, products) => {
            sellingPosts.countDocuments(filterOpt,(err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({
                    result: products,
                    totalCount: count
                });
            });
        })
});

router.get('/searchSellingPost', function (req, res, next) {

    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    //db.products.find( { sku: { $regex: /789$/ } } )
    //let filterOpt = {productName: {$regex: req.query.productName, $options: 'i'}}

    let filterOpt = {productName: {$regex: req.query.productName, $options: 'i'}}
    console.log('filterOpt   ===>   ', filterOpt)
    //productName
    sellingPosts
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .exec((err, products) => {
            sellingPosts.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products
                    ,totalCount: count});
            });
        })
});





//* Delete all data from Categoty schema
router.get('/deleteAll', (req, res, next) => {
    console.log('*********  deleteAll  category');
    sellingPosts.remove((err, removed) => {
        if (err) return next(err);
        let json = {
            'status': 'remove all is successfully',
        }
        res.json(json)
    });
});


router.post('/getByUser', function (req, res, next) {

    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    //let filterOpt = {$regex: req.query.productName, $options: 'i'};


    let filterOpt = {userId: {$regex: req.body.userId, $options: 'i'}}
    console.log('getByUser req ==> ', req.body)
    sellingPosts
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .exec((err, products) => {
            sellingPosts.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products,totalCount: count});
            });
        })
});


router.post('/getByFullName', function (req, res, next) {

    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    //let filterOpt = {$regex: req.query.productName, $options: 'i'};

    Users.findOne({'local.fullName': req.body.fullName}, function (err, user) {
        if (user) {
            let filterOpt = {userId: {$regex: user._id, $options: 'i'}}
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


router.get('/getByShop', function (req, res, next) {

    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    Users.findOne({'local.shopPath': req.query.shopPath}, function (err, user) {
        if (err) {
            console.log('**** Sign Up err  ', err)
            res.json({errorMessage: "Lỗi"});
        }
        if (user) {
            let filterOpt = {userId: {$regex: user._id, $options: 'i'}}
            console.log('getByShop user ==> ', user,user._id)
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



router.post('/createOne', (req, res, next) => {


    const obj = req.body
    console.log('**** POST  Categories   ', req.body, '  --  userId ==> ',req.body.fullName);

    Users.findById(req.body.userId, (err, user) => {
        console.log(' Create Selling user ==> ',user)
        if (user === null) {
            let errorJson = {
                outOfPoint:true,
                errorMessage: "OutOfPoint"
            }

            res.json(errorJson);
        } else {
            if (user.local.point > POINT_PER_POST) {
                let sellingPost = req.body
                sellingPost.isApprove = false
                sellingPosts.create(sellingPost, (err, post) => {
                    if (err) return next(err);
                    console.log('****   post Categories  ', post);

                    let updatedInfo = user
                    updatedInfo.local.point = updatedInfo.local.point - POINT_PER_POST
                    Users.findByIdAndUpdate(user._id, updatedInfo, (err, newUser) => {
                        if (err) {
                            console.log('***   Error ', err);
                            return next(err);
                        }
                    });

                    res.json(post);
                });
            }
        }


        //res.json({user:user});
    })


});

router.get('/:id', (req, res, next) => {
    sellingPosts.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});




router.put('/:id', (req, res, next) => {
    console.log('***   req.params.id  ', req.params.id);
    console.log('***   req.body   ', req.body);
    sellingPosts.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        console.log('Find a product first ==>   ', post.userId)
        //res.json(post);
        if (post.userId === req.body.userId) {

            Users.findById(req.body.userId, (err, user) => {
                if (err) return next(err);
                if (user.local.point > POINT_PER_EDIT) {
                    let updatedInfo = user
                    updatedInfo.local.point = updatedInfo.local.point - POINT_PER_EDIT
                    Users.findByIdAndUpdate(user._id, updatedInfo, (err, newUser) => {
                        if (err) {
                            console.log('***   Error ', err);
                            return next(err);
                        }
                    });

                    let editObj = req.body
                    editObj.isApprove = false
                    console.log(' editObj  ===========>  ',editObj  )
                    sellingPosts.findByIdAndUpdate(req.params.id, editObj, (err, post) => {
                        if (err) {
                            console.log('***   Error ', err);
                            return next(err);
                        }
                        res.json(post);

                    });
                } else {
                    let errorJson = {
                        outOfPoint:true,
                        errorMessage: "OutOfPoint"
                    }

                    res.json(errorJson);
                }

            })


        } else {
            let errorJson = {
                "errorMessage": "Không có quyền edidt"
            }
            res.status(401).json(errorJson);
        }

    });

});



router.delete('/:id', (req, res, next) => {
    console.log('***   req.params  ', req.params);
    console.log('***   req.body   ', req.body);
    sellingPosts.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        console.log('Find a product first ==>   ', post.productName)
        //res.json(post);
        if (post) {
            if (post.userId === req.body.userId) {
                console.log('-----------------  DELETE SELLING PRODUCT ----------')
                sellingPosts.findByIdAndRemove(req.params.id, req.body, (err, post) => {
                    if (err) {
                        console.log('***   Error ', err);
                        return next(err);
                    }
                    res.json(post);

                });


            } else {
                let errorJson = {
                    "errorMessage": "Không có quyền edit"
                }
                res.status(401).json(errorJson);
            }
        } else {
            let errorJson = {
                "errorMessage": "Sản phẩm không tồn tại"
            }
            res.status(401).json(errorJson);
        }


    });

});






router.put('/ADMIN/:id', (req, res, next) => {
    console.log('***   req.params.id  ', req.params.id);
    console.log('***   req.body   ', req.body);
    sellingPosts.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
        if (err) {
            console.log('***   Error ', err);
            return next(err);
        }
        res.json(post);

    });

});




router.delete('/ADMIN/:id', (req, res, next) => {
    console.log('***   req.params  ', req.params);
    console.log('***   req.body   ', req.body);
    sellingPosts.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        console.log('Find a product first ==>   ', post.productName)
        //res.json(post);
        if (post) {
            sellingPosts.findByIdAndRemove(req.params.id, req.body, (err, post) => {
                if (err) {
                    console.log('***   Error ', err);
                    return next(err);
                }
                res.json(post);

            });
        } else {
            let errorJson = {
                "errorMessage": "Sản phẩm không tồn tại"
            }
            res.status(401).json(errorJson);
        }


    });

});










module.exports = router;
