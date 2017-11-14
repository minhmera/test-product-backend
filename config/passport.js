// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({ 'local.email':  email }, function(err, user) {
                    console.log('**** findOne email   ',email)
                    console.log('**** findOne  user ',user)
                    console.log('**** findOne  err ',err)
                    if (err){
                        console.log('**** Sign Up err  ',err)
                        return done(err);
                    }

                    if (user) {
                        console.log('**** Sign Up user  ',user)
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new User();
                        console.log('**** Sign Up newUser  ',newUser)
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            console.log('**************   Login   ********** ')
            User.findOne({ 'local.email':  email }, function(err, user) {
                if (err){
                    console.log('***  Error    ',err)
                    return done(err);
                }

                if (!user){
                    console.log('***  No user found ')
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                if (!user.validPassword(password)){
                    console.log('***  Wrong password. ')
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                return done(null, user);
            });
        }));

};
