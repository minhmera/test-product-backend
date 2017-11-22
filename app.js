var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//define routers
var routes = require('./routes/index');
var todos = require('./routes/todos');
var news = require('./routes/news');
var auth = require('./routes/auth');

// load mongoose package
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;


// set middleware
const authCheckMiddleware = require('./middleware/auth-check');

// connect to MongoDB
mongoose.connect('mongodb://localhost/nong-nghiep')
    .then(()=>  console.log('connection to nong-nghiep succesful'))
.catch((err) => console.error(err));

var app = express();

// Config auth
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'shhsecret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//config middleware
//app.use('/auth', authCheckMiddleware);
app.use('/news', authCheckMiddleware);

// config routers
app.use('/', routes);
app.use('/todos', todos);
app.use('/news', news);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
