const express = require('express');

const router = express.Router();
const moment = require('moment');
const Users = require('../models/user');
const buyingPost = require('../models/buying_post');
const POINT_PER_POST = 0
const POINT_PER_EDIT = 0



/* GET /todos listing. */
router.get('/getAll', (req, res, next) => {
    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;
    let filterOpt = { "isApprove": true }
    buyingPost
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .exec((err, products) => {
            buyingPost.countDocuments(filterOpt,(err, count) => {
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
    let filterOpt = { "isApprove": req.query.status }

    buyingPost
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .exec((err, products) => {
            buyingPost.countDocuments(filterOpt,(err, count) => {
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

    let filterOpt = {"categoryId": req.query.categoryId,"isApprove": true}
    if (req.query.provinceId) {
        filterOpt.provinceId = req.query.provinceId
    }

    buyingPost
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        //.sort({order: 1})
        .exec((err, products) => {
            buyingPost.countDocuments(filterOpt,(err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products,totalCount: count});
            });
        })
});

router.get('/searchBuyingPost', function (req, res, next) {

    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    //let filterOpt = {$regex: req.query.productName, $options: 'i'};

    let filterOpt = {productName: {$regex: req.query.productName, $options: 'i'}}
    console.log('filterOpt   ===>   ', filterOpt)
    //productName
    buyingPost
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .exec((err, products) => {
            buyingPost.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products,totalCount: count});
            });
        })
});


router.post('/getByUser', function (req, res, next) {

    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;

    //let filterOpt = {$regex: req.query.productName, $options: 'i'};

    let filterOpt = {userId: {$regex: req.body.userId, $options: 'i'}}
    console.log('BUYING ==>  getByUser  ', req.body)
    //productName
    buyingPost
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .exec((err, products) => {
            buyingPost.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products,totalCount: count});
            });
        })
});


//* Delete all data from Categoty schema
router.get('/deleteAll', (req, res, next) => {
    console.log('*********  deleteAll  category');
    buyingPost.remove((err, removed) => {
        if (err) return next(err);
        let json = {
            'status': 'remove all is successfully',
        }
        res.json(json)
    });
});


router.post('/createOne', (req, res, next) => {
    console.log('**** POST  Categories   ', req.body);


    Users.findById(req.body.userId, (err, user) => {
        //if (err) return next(err);
        console.log(' Create Selling Post user  =>   ',user)
        if (user.local.point > POINT_PER_POST) {
            let buyingPost = req.body
            buyingPost.isApprove = false
            buyingPost.create(buyingPost, (err, post) => {
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
        } else {
            let errorJson = {
                outOfPoint:true,
                errorMessage: "OutOfPoint"
            }

            res.json(errorJson);
        }

        //res.json({user:user});
    })


});

/* GET /todos/id */
router.get('/:id', (req, res, next) => {
    buyingPost.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.put('/:id', (req, res, next) => {
    console.log('***   req.params.id  ', req.params.id);
    console.log('***   req.body   ', req.body);
    buyingPost.findById(req.params.id, (err, post) => {
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

                    buyingPost.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
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

//==========
router.delete('/:id', (req, res, next) => {
    console.log('***   req.params  ', req.params);
    console.log('***   req.body   ', req.body);
    buyingPost.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        console.log('Find a product first ==>   ', post.productName)
        //res.json(post);
        if (post) {
            if (post.userId === req.body.userId) {
                console.log('-----------------  DELETE SELLING PRODUCT ----------')
                buyingPost.findByIdAndRemove(req.params.id, req.body, (err, post) => {
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


    buyingPost.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
        if (err) {
            console.log('***   Error ', err);
            return next(err);
        }
        res.json(post);

    });
});

module.exports = router;
