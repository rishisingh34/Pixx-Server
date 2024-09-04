const mongoose = require("mongoose");
const { DB_URI } = require("./env.config");

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI); 
    console.log("Database connected successfully");
   
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};

module.exports = connectDB;