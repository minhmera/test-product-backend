const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

// define routers
const mongoose = require('mongoose');
const routes = require('./routes/index');
const todos = require('./routes/todos');
const news = require('./routes/news');
const categories = require('./routes/categories');
const productList = require('./routes/product_list');
const getLocation = require('./routes/get_location');
const imageUpload = require('./routes/image_upload');
const auth = require('./routes/auth');

// load mongoose package

// Use native Node promises
mongoose.Promise = global.Promise;


// set middleware
const authCheckMiddleware = require('./middleware/auth-check');

// connect to local  MongoDB
// mongoose.connect('mongodb://localhost/product_banle_beta')
//     .then(()=>  console.log('connection to nong-nghiep succesful'))
// .catch((err) => console.error(err));

// connect to Server MongoDB

const configDB = require('./config/database.js');

mongoose.connect(configDB.urlHeroku)
  .then(() => console.log('============connection to DB is success fully =======', configDB.urlLocal))
  .catch(err => console.error(' connection to mongodb has error  ', err));


const app = express();

// Config auth
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(session({ secret: 'shhsecret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('dist'));

// config middleware
// app.use('/auth', authCheckMiddleware);
// app.use('/news', authCheckMiddleware);


// config routers
app.use('/', routes);
app.use('/todos', todos);
app.use('/news', news);
app.use('/categories', categories);
app.use('/productList', productList);
app.use('/getLocation', getLocation);
app.use('/image-upload', imageUpload);
app.use('/auth', auth);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     console.log('******************    catch 404 and forward to error handler  ******************')
//     err.status = 404;
//     next(err);
// });

// Enable Cors
// app.use(function(req, res, next) {
//     console.log('******************    Enable Cross domain  ******************')
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}!`));

// module.exports = app;
