require('dotenv').config()
module.exports = {
  urlLocal    :  process.env.URL_DB_LOCAL,
  urlHeroku   : process.env.URL_DB_HEROKU
};