const express = require('express');

const router = express.Router();

const Todo = require('../models/Todo.js');

/* GET /todos listing. */
router.get('/', (req, res, next) => {
  Todo.find((err, todos) => {
    if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', (req, res, next) => {
  console.log('****   req  ', req.body);
  Todo.create(req.body, (err, post) => {
    if (err) return next(err);
    console.log('****   user  ', post);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', (req, res, next) => {
  Todo.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', (req, res, next) => {
  Todo.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', (req, res, next) => {
  Todo.findByIdAndRemove(req.params.id, req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
