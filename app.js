var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors =  require('cors');

//define routers
var routes = require('./routes/index');
var todos = require('./routes/todos');
var news = require('./routes/news');
var categories = require('./routes/categories');
var productList = require('./routes/product_list');
var getLocation = require('./routes/get_location');
var imageUpload = require('./routes/image_upload');
var auth = require('./routes/auth');

var sellingPost = require('./routes/selling_post');
var buyingPost = require('./routes/buying_post');



// load mongoose package
var mongoose = require('mongoose');
var mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

// Use native Node promises
mongoose.Promise = global.Promise;


// set middleware
const authCheckMiddleware = require('./middleware/auth-check');


var configDB = require('./config/database.js');
// mongoose.connect(configDB.urlHeroku)
//     .then(()=>  console.log('connection to nong-nghiep succesful'))
//     .catch((err) => console.error(' connection to mongodb has error  ',err));



const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(configDB.urlHeroku,connectionParams)
  .then( () => {
      console.log('Connected to database ')
  })
  .catch( (err) => {
      console.error(`Error connecting to the database. \n${err}`);
  })



var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.setHeader('Access-Control-Allow-Origin', 'https://dongxanh-frontend.herokuapp.com');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// Config auth
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
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
app.use(bodyParser.text({type: 'text/plain'}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//config middleware
//app.use('/auth', authCheckMiddleware);
app.use('/productList', authCheckMiddleware);
app.use('/sellingPost', authCheckMiddleware);
app.use('/buyingPost', authCheckMiddleware);
//app.use('/auth', authCheckMiddleware);
//app.use('/categories', authCheckMiddleware);
//app.use('/image-upload', authCheckMiddleware);


// config routers
app.use('/', routes);
app.use('/todos', todos);
app.use('/news', news);
app.use('/categories', categories);
app.use('/productList', productList);
app.use('/getLocation', getLocation);
app.use('/image-upload', imageUpload);
app.use('/auth', auth);

app.use('/sellingPost', sellingPost);
app.use('/buyingPost', buyingPost);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log('******************    catch 404 and forward to error handler  ******************',err)
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
