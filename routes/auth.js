var express = require('express');
var passport = require('passport');
var bcrypt   = require('bcrypt')
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
});

router.get('/signupSuccess', function(req, res, next) {
    const payload = {
        sub: req.user._id
    };
    console.log('***   signup Success   user ',req.user)

    var resultObj = {
        success:true,
        message:"Register user has successfully",
        userInfo: req.user,
    }
    res.json({result:resultObj})
});

router.get('/signupFailed', function(req, res, next) {
    let msg =  req.flash('signupMessage')[0]
    console.log('***   signup Success   user ',req.user)
    var resultObj = {
        success:false,
        message:msg,
        userInfo: null,
    }
    res.json({result:resultObj})
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
    successRedirect: '/auth/signupSuccess',
    failureRedirect: '/auth/signupFailed',
    failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
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

router.get('/updatePassByName/:username', function(req, res, next) {
    console.log('findUserByName param ==>   ', req.params.username)

    Users.findOne({ 'local.username':  req.params.username }, function(err, user) {
        console.log('MERA  user  ==>  ', user)

        let randomPass = genRandomPass(8)
        let hasPass = genHashPass(randomPass)

        let updateUser = {
           'local.password':hasPass
        }
        console.log('MERA  updateUser  ==>  ', updateUser, 'hasPass ==>  ' ,hasPass)
        Users.findByIdAndUpdate(user._id, updateUser, (err, updatedUser) => {
            if (err) {
                console.log('***   Error ', err);
                return next(err);
            }
            let newUser = {
                newPass: randomPass,
                updatedUser
            }
            console.log('MERA  newUser  ==>  ', newUser)
            res.json(newUser);
        });


        //res.json(user);

    })

});

function genRandomPass(length) {
    let result = '';
    let characters = 'ABCDEFGH0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function genHashPass(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
