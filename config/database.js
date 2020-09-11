/** Using heroku **/
require('dotenv').config()
module.exports = {
  urlLocal    :  process.env.URL_DB_LOCAL,
  urlHeroku   : process.env.URL_DB_HEROKU
};
let dbUrl = "mongodb+srv://nhatminhn900@gmail.com:M!nh1008@cluster0.lfnjl.mongodb.net/test?retryWrites=true&w=majority"
//mongodb+srv://nhatminhn900@gmail.com:M!nh1008@@cluster0.lfnjl.mongodb.net/test
/** Using local **/
// module.exports = {
//   urlLocal: 'mongodb://localhost/gofo',
//   urlHeroku: 'mongodb://heroku_n1w7rslr:m3f4hhv8vb2hsgfp5rq1v3p5r4@ds129484.mlab.com:29484/heroku_n1w7rslr',
//   //urlHeroku: 'mongodb://minhmera:fortunate@cluster0-shard-00-00.lfnjl.mongodb.net:27017,cluster0-shard-00-01.lfnjl.mongodb.net:27017,cluster0-shard-00-02.lfnjl.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-14sgog-shard-0&authSource=admin&retryWrites=true&w=majority',
// };


//mongodb://heroku_n1w7rslr:m3f4hhv8vb2hsgfp5rq1v3p5r4@ds129484.mlab.com:29484/heroku_n1w7rslr
//mongodb://heroku_n1w7rslr:m3f4hhv8vb2hsgfp5rq1v3p5r4@ds129484.mlab.com:29484/heroku_n1w7rslr

