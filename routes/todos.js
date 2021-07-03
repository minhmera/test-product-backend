var express = require('express');
var router = express.Router();

var Todo = require('../models/Todo.js');


let rewardJson = [
  {
    'name': 'Free ship under 20k',
    'validDate': new Date('2020-12-21T03:24:00'),
    'quantity':1,
  },
  {
    'name': 'Discount 30k',
    'validDate': new Date('2020-12-22T03:24:00'),
    'quantity':1,
  },
  {
    'name': 'Free Desert',
    'validDate': new Date('2020-12-23T03:24:00'),
    'quantity':1,
  },
  {
    'name': 'Bonus voucher 200k ',
    'validDate': new Date('2020-12-24T03:24:00'),
    'quantity':1,
  },
  {
    'name': 'Free for children',
    'validDate': new Date('2020-12-25T03:24:00'),
    'quantity':1,
  },

];


router.get('/mockTest', function (req, res, next) {
  //console.log('locationVNData  ==> ', locationVNData)
  res.json(rewardJson );
});


/* GET /todos listing. */
router.get('/', function (req, res, next) {
  Todo.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', function (req, res, next) {
  console.log('****   req  ', req.body);
  Todo.create(req.body, function (err, post) {
    if (err) return next(err);
    console.log('****   user  ', post);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function (req, res, next) {
  Todo.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function (req, res, next) {
  Todo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function (req, res, next) {
  Todo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
