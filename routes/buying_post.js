const express = require('express');

const router = express.Router();

const buyingPost = require('../models/buying_post');

/* GET /todos listing. */
router.get('/getAll', (req, res, next) => {
  // eslint-disable-next-line array-callback-return
  // buyingPost.find((err, categories) => {
  //   if (err) return next(err);
  //   console.log('***** Get categories length ', categories.length);
  //   res.json({ result: categories });
  // })
  //   .sort({ order: 1 });


    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var skip = page > 0 ? ((page - 1) * size) : 0;


    buyingPost.find(null, null, {skip: skip, limit: size}, function (err, categories) {
        if (err) return next(err);
        console.log('***** Get categories length ', categories.length);
        res.json({result: categories});
    }).sort({order: 1});



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
