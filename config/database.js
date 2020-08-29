/** Using heroku **/
require('dotenv').config()
module.exports = {
  urlLocal    :  process.env.URL_DB_LOCAL,
  urlHeroku   : process.env.URL_DB_HEROKU
};

/** Using local **/
// module.exports = {
//   urlLocal: 'mongodb://localhost/gofo',
//   urlHeroku: 'mongodb://heroku_n1w7rslr:m3f4hhv8vb2hsgfp5rq1v3p5r4@ds129484.mlab.com:29484/heroku_n1w7rslr',
// };
