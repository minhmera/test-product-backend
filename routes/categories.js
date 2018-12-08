var express = require('express');
var router = express.Router();

var Categories = require('../models/categories');

/* GET /todos listing. */
router.get('/', function(req, res, next) {



    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;

    Categories.find(null, null, {skip: skip, limit: size},function (err, news) {
        if (err) return next(err);
        console.log('***** Get categories length ',news.length)
        //res.json(news);
        // res.json({result:news})
        setTimeout(function()
        {
            //console.log('your name')
            res.json({result:news})

        },2000);


    });
});



/* POST /Categories */
router.post('/', function(req, res, next) {
    console.log('**** POST  Categories   ',req.body)
    Categories.create(req.body, function (err, post) {
        if (err) return next(err);
        console.log('****   post Categories  ',post)
        res.json(post);
    });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
    Categories.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
    console.log('***   req.params.id  ',req.params.id)
    console.log('***   req.body   ',req.body)
    Categories.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    Categories.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
