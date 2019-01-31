var express = require('express');
var passport = require('passport');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Users = require('../models/user');
var config  = require('../config/config')

router.get('/', function(req, res, next) {
    res.render('auth.ejs', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/loginFailed', function(req, res, next) {
    res.json({result:'Login failed'})
    //res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/loginSuccess', function(req, res, next) {
    const payload = {
        sub: req.user._id
    };
    const token = jwt.sign(payload, config.jwtSecret);
    console.log('******* token   ',token)
    console.log('***   loginSuccess   user ',req.user)

    var resultObj = {
        userInfo: req.user,
        token: token
    }
    res.json({result:resultObj})
    //res.render('login.ejs', { message: req.flash('loginMessage') });
});


router.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('loginMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/auth/signup',
   // failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
    //successRedirect: '/auth/profile',
    successRedirect: '/auth/loginSuccess',
    failureRedirect: '/auth/loginFailed',
    failureFlash: true,
}));



// ************    Test

// /* GET /todos listing. */
router.get('/users', function(req, res, next) {

    Users.find(function (err, news) {
        if (err) return next(err);
        console.log('*****  Users length ',news.length)
        //res.json(news);
        res.json({result:news})


    });
});

/* DELETE /todos/:id */
router.delete('/users/:id', function(req, res, next) {
    Users.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});



module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
