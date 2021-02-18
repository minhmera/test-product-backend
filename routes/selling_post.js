const express = require('express');

const router = express.Router();

const sellingPosts = require('../models/selling_post');

/* GET /todos listing. */
router.get('/getAll', (req, res, next) => {
    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;

    sellingPosts
        .find()
        .skip(skip)
        .limit(size)
        //.sort({order: 1})
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
        //.sort({order: 1})
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

    var filterOpt = { productName: { $regex: req.query.productName, $options: 'i' }}
    console.log('filterOpt   ===>   ', filterOpt)
    //productName
    sellingPosts
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        //.sort({order: 1})
        .exec((err, products) => {
            sellingPosts.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products});
            });
        })
});


router.get('/getByUser', function (req, res, next) {

    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;

    //var filterOpt = {$regex: req.query.productName, $options: 'i'};

    var filterOpt = { userId: { $regex: req.query.userId, $options: 'i' }}
    console.log('filterOpt   ===>   ', filterOpt, 'req ==> ',req.query)
    //productName
    sellingPosts
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        //.sort({order: 1})
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


/* POST /Categories */
router.post('/createOne', (req, res, next) => {
    console.log('**** POST  Categories   ', req.body);
    sellingPosts.create(req.body, (err, post) => {
        if (err) return next(err);
        console.log('****   post Categories  ', post);
        res.json(post);
    });
});

/* GET /todos/id */
router.get('/:id', (req, res, next) => {
    sellingPosts.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /todos/:id */
router.put('/:id', (req, res, next) => {
    console.log('***   req.params.id  ', req.params.id);
    console.log('***   req.body   ', req.body);
    sellingPosts.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        console.log('Find a product first ==>   ',post.userId)
        //res.json(post);
        if (post.userId === req.body.userId ) {
            sellingPosts.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
                if (err) {
                    console.log('***   Error ', err);
                    return next(err);
                }
                res.json(post);
            });
        } else {
            let errorJson = {
                "errorMessage":"Không có quyền edidt"
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
