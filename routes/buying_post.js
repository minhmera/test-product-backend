const express = require('express');

const router = express.Router();

const buyingPost = require('../models/buying_post');

/* GET /todos listing. */
router.get('/getAll', (req, res, next) => {
    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;


    buyingPost
        .find()
        .skip(skip)
        .limit(size)
        //.sort({order: 1})
        .exec((err, products) => {
            buyingPost.countDocuments((err, count) => {
                console.log('All Page ==>  count ',count)
                if (err) return next(err);
                res.json({result: products});
            });
        });
});


router.get('/getByCategory', (req, res, next) => {
    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;

    var filterOpt = {"categoryId": req.query.categoryId}
    if (req.query.provinceId) {
        filterOpt.provinceId = req.query.provinceId
    }
    // Stupid Error

    // buyingPost.find(filterOpt, {skip: skip, limit: size}, function (err, categories) {
    //     if (err) return next(err);
    //     console.log('***** Get categories length ', categories.length);
    //     res.json({result: categories});
    // }).sort({order: 1});


    buyingPost
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        //.sort({order: 1})
        .exec((err, products) => {
            buyingPost.countDocuments((err, count) => {
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

    console.log('MERA getByUser req.body' )
    //var filterOpt = {$regex: req.query.productName, $options: 'i'};

    var filterOpt = { userId: { $regex: req.query.userId, $options: 'i' }}
    console.log('filterOpt   ===>   ', filterOpt,' req ==> ', req)
    //productName
    buyingPost
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        //.sort({order: 1})
        .exec((err, products) => {
            buyingPost.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products});
            });
        })
});


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


/* POST /Categories */
router.post('/createOne', (req, res, next) => {
  console.log('**** POST  Categories   ', req.body);
  buyingPost.create(req.body, (err, post) => {
    if (err) return next(err);
    console.log('****   post Categories  ', post);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', (req, res, next) => {
  buyingPost.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', (req, res, next) => {
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

/* DELETE /todos/:id */
router.delete('/:id', (req, res, next) => {
  buyingPost.findByIdAndRemove(req.params.id, req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
