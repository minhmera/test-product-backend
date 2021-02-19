// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
// load up the user model
var User       		= require('../models/user');
var config  = require('../config/config')


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log('*** serializeUser  ',user)
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log('*** deserializeUser  ')
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            fullNameField: 'fullName',
            passReqToCallback: true,
        },
        function(req, username, password, done) {
            console.log('**** Sign up ==>  user ',req.body)
            process.nextTick(function() {
                User.findOne({ 'local.username':  username }, function(err, user) {
                    //console.log('**** findOne email   ',email)
                    //console.log('**** findOne  user ',user)
                    //console.log('**** findOne  err ',err)
                    if (err){
                        console.log('**** Sign Up err  ',err)
                        return done(err);
                    }
                    if(username.length < 4){
                        return done(null, false, req.flash('signupMessage', 'Username must be longer than 4 characters'));
                    }

                    if(password.length < 8){
                        return done(null, false, req.flash('signupMessage', 'Password must be longer than 8 characters'));
                    }

                    if (user) {
                        console.log('--------------- Sign Up user ------------------ ')
                        return done(null, false, req.flash('signupMessage', 'Tên này đã được sử dụng'));
                    } else {
                        var newUser = new User();

                        newUser.local.username = username
                        newUser.local.fullName = req.body.fullName
                        newUser.local.phoneNumber = req.body.phoneNumber
                        newUser.local.password = newUser.generateHash(password);
                        console.log('**** Sign Up newUser  ',newUser)
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
            usernameField: 'username',
            passwordField: 'password',
            session: false,
            passReqToCallback: true,
        },
        //function(req, email, password, done) {
        function(req, username, password, done) {
            console.log('**************   Login   ********** ')
            User.findOne({ 'local.username':  username }, function(err, user) {
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

                return done(null,user);
            });
        }));

};
