const express = require('express');

const router = express.Router();

const sellingPosts = require('../models/selling_post');
const Users = require('../models/user');

const POINT_PER_POST = 2
const POINT_PER_EDIT = 1

/* GET /todos listing. */
router.get('/getAll', (req, res, next) => {
    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;

    sellingPosts
        .find()
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .exec((err, products) => {
            sellingPosts.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products});
            });
        });

});

router.get('/getByCategory', function (req, res, next) {
    console.log('query   ===>   ', req.query)
    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;

    var filterOpt = {"categoryId": req.query.categoryId}
    if (req.query.provinceId) {
        filterOpt.provinceId = req.query.provinceId
    }

    sellingPosts
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        .sort({createDate: -1})
        .exec((err, products) => {
            sellingPosts.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products});
            });
        })
});

router.get('/searchSellingPost', function (req, res, next) {

    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;

    //var filterOpt = {$regex: req.query.productName, $options: 'i'};

    var filterOpt = {productName: {$regex: req.query.productName, $options: 'i'}}
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
                res.json({result: products});
            });
        })
});


router.post('/getByUser', function (req, res, next) {

    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;

    //var filterOpt = {$regex: req.query.productName, $options: 'i'};


    var filterOpt = {userId: {$regex: req.body.userId, $options: 'i'}}
    console.log('getByUser req ==> ', req.body)
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
                res.json({result: products});
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


router.post('/createOne', (req, res, next) => {
    console.log('**** POST  Categories   ', req.body);


    Users.findById(req.body.userId, (err, user) => {
        if (err) return next(err);
        if (user.local.point > POINT_PER_POST) {
            sellingPosts.create(req.body, (err, post) => {
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

                    sellingPosts.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
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

/* DELETE /todos/:id */
router.delete('/:id', (req, res, next) => {
    sellingPosts.findByIdAndRemove(req.params.id, req.body, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
