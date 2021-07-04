// config/passport.js

// load all the things we need
let LocalStrategy = require('passport-local').Strategy;
let jwt = require('jsonwebtoken');
// load up the user model
let User = require('../models/user');
let config = require('../config/config')
let Utils = require('../utils/Utils')
const POINT_FOR_NEW_USER = 1000

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        console.log('*** serializeUser  ', user)
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log('*** deserializeUser  ')
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            fullNameField: 'fullName',
            passReqToCallback: true,
        },
        function (req, username, password, done) {
            console.log('**** Sign up ==>  user ', req.body)
            let userName = req.body.username
            let fullName = req.body.fullName

            if (Utils.isUserNameError(userName) === true || Utils.isFullNameError(fullName) === true) {
                return done(null, false, req.flash('signupMessage', 'Lỗi định dạng'));
            } else {
                process.nextTick(function () {
                    User.findOne({'local.fullName': req.body.fullName}, function (err, user) {
                        if (err) {
                            console.log('**** Sign Up err  ', err)
                            return done(err);
                        }

                        if (user) {
                            console.log('--------------- Sign Up user ------------------ ')
                            return done(null, false, req.flash('signupMessage', 'Tên bán hàng này đã được sử dụng'));
                        } else {
                            User.findOne({'local.username': username}, function (err, user) {
                                if (err) {
                                    console.log('**** Sign Up err  ', err)
                                    return done(err);
                                }
                                if (username.length < 4) {
                                    return done(null, false, req.flash('signupMessage', 'Username must be longer than 4 characters'));
                                }

                                if (password.length < 8) {
                                    return done(null, false, req.flash('signupMessage', 'Password must be longer than 8 characters'));
                                }

                                if (user) {
                                    console.log('--------------- Sign Up user ------------------ ')
                                    return done(null, false, req.flash('signupMessage', 'Tên này đã được sử dụng'));
                                } else {
                                    let newUser = new User();
                                    newUser.local.username = username
                                    newUser.local.fullName = req.body.fullName
                                    newUser.local.phoneNumber = req.body.phoneNumber
                                    newUser.local.point = POINT_FOR_NEW_USER
                                    newUser.local.password = newUser.generateHash(password);

                                    console.log('**** Sign Up newUser  ', newUser, ' point ==>  ', req.body.point)
                                    newUser.save(function (err) {
                                        if (err)
                                            throw err;
                                        return done(null, newUser);
                                    });
                                }
                            });
                        }
                    })

                });
            }
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            session: false,
            passReqToCallback: true,
        },
        //function(req, email, password, done) {
        function (req, username, password, done) {
            console.log('**************   Login   ********** ')
            User.findOne({'local.username': username}, function (err, user) {
                if (err) {
                    console.log('***  Error    ', err)
                    return done(err);
                }

                if (!user) {
                    console.log('***  No user found ')
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                if (!user.validPassword(password)) {
                    console.log('***  Wrong password. ')
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                return done(null, user);
            });
        }));

};
