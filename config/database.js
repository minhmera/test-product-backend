/** Using heroku **/
require('dotenv').config()
module.exports = {
  urlLocal    :  process.env.URL_DB_LOCAL,
 // urlHeroku   : process.env.URL_DB_HEROKU
  urlHeroku   : "mongodb+srv://minhmera:fortunate@cluster0.lfnjl.mongodb.net/gogo_mobile?retryWrites=true&w=majority"

};
/** Using local **/
