const express = require('express');

const router = express.Router();

const Categories = require('../models/categories');

/* GET /todos listing. */
router.get('/getAll', (req, res, next) => {
    // eslint-disable-next-line array-callback-return
    Categories.find((err, categories) => {
        if (err) return next(err);
        console.log('***** Get categories length ', categories.length);
        res.json({ result: categories });
    })
      .sort({ order: 1 });
});

/** Delete all data from Categoty schema
 router.get('/deleteAll', (req, res, next) => {
  console.log('*********  deleteAll  category');
  Categories.remove((err, removed) => {
    if (err) return next(err);
    let json = {
      'status': 'remove all is successfully',
    }
    res.json(json)
  });
});
 **/

/* POST /Categories */
router.post('/createOne', (req, res, next) => {
    console.log('**** POST  Categories   ', req.body);
    Categories.create(req.body, (err, post) => {
        if (err) return next(err);
        console.log('****   post Categories  ', post);
        res.json(post);
    });
});

/* GET /todos/id */
router.get('/:id', (req, res, next) => {
    Categories.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /todos/:id */
router.put('/:id', (req, res, next) => {
    console.log('***   req.params.id  ', req.params.id);
    console.log('***   req.body   ', req.body);
    Categories.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
        if (err) {
            console.log('***   Error ', err);
            return next(err);
        }
        res.json(post);
    });
});

/* DELETE /todos/:id */
router.delete('/:id', (req, res, next) => {
    Categories.findByIdAndRemove(req.params.id, req.body, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
