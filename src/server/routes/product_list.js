const express = require('express');

const router = express.Router();

const ProductList = require('../models/product_list');

/* GET /todos listing. */
router.get('/', (req, res, next) => {
  console.log('query   ===>   ', req.query);

  ProductList.find({ type: req.query.type }, (err, products) => {
    if (err) return next(err);
    console.log('***** Get products length ', products);
    res.json({ result: products });
  });
});


/* POST /ProductList */
router.post('/', (req, res, next) => {
  console.log('**** POST  ProductList   ', req.body);
  ProductList.create(req.body, (err, post) => {
    if (err) return next(err);
    console.log('****   post ProductList  ', post);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', (req, res, next) => {
  ProductList.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', (req, res, next) => {
  console.log('***   req.params.id  ', req.params.id);
  console.log('***   req.body   ', req.body);
  ProductList.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) {
      console.log('***   Error ', err);
      return next(err);
    }
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', (req, res, next) => {
  ProductList.findByIdAndRemove(req.params.id, req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
