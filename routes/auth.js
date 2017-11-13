var express = require('express');
var passport = require('passport');
var router = express.Router();

var Users = require('../models/user');


router.get('/', function(req, res, next) {
    res.render('auth.ejs', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
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
    successRedirect: '/profile',
    failureRedirect: '/login',
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



module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
