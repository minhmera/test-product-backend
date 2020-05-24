// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
// load up the user model
const User = require('../models/user');
const config = require('./config');


module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    console.log('*** serializeUser  ');
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('*** deserializeUser  ');
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  ((req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({ 'local.email': email }, (err, user) => {
        console.log('**** findOne email   ', email);
        console.log('**** findOne  user ', user);
        console.log('**** findOne  err ', err);
        if (err) {
          console.log('**** Sign Up err  ', err);
          return done(err);
        }

        if (user) {
          console.log('**** Sign Up user  ', user);
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }
        const newUser = new User();
        console.log('**** Sign Up newUser  ', newUser);
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        newUser.save((err) => {
          if (err) throw err;
          return done(null, newUser);
        });
      });
    });
  })));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  ((req, email, password, done) => {
    console.log('**************   Login   ********** ');
    User.findOne({ 'local.email': email }, (err, user) => {
      if (err) {
        console.log('***  Error    ', err);
        return done(err);
      }

      if (!user) {
        console.log('***  No user found ');
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }

      if (!user.validPassword(password)) {
        console.log('***  Wrong password. ');
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }

      return done(null, user);
    });
  })));
};
