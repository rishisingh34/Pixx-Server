require('dotenv').config() ;

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI, 
  ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET ,
  EMAIL : process.env.EMAIL ,
  PASS : process.env.PASS ,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  baseUrl : process.env.BASE_URL 
};
