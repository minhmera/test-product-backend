var express = require('express');
var router = express.Router();

var ProductList = require('../models/product_list');

/* GET /todos listing. */
router.get('/', function(req, res, next) {


    console.log('query   ===>   ',req.query)

    ProductList.find({"type": req.query.type},function (err, products) {
        if (err) return next(err);
        console.log('***** Get products length ',products)
        res.json({result:products})
    });
});



/* POST /ProductList */
router.post('/', function(req, res, next) {
    console.log('**** POST  ProductList   ',req.body)
    ProductList.create(req.body, function (err, post) {
        if (err) return next(err);
        console.log('****   post ProductList  ',post)
        res.json(post);
    });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
    ProductList.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
    console.log('***   req.params.id  ',req.params.id)
    console.log('***   req.body   ',req.body)
    ProductList.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err)
        {
            console.log('***   Error ',err)
            return next(err)
        };
        res.json(post);
    });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
    ProductList.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
