const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  thumbnail : {
    type : String , 
    required : true , 
  },
  title  : {
    type : String , 
    required : true , 
  },
  user : {
    type : mongoose.Schema.Types.ObjectId , 
    ref : 'User'
  }
}, { createdAt : true });

module.exports = mongoose.model('Post',postSchema);