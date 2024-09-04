const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username : {
    type : String , 
    required : true , 
  },
  email : {
    type : String , 
    required : true , 
  },
  password : {
    type : String , 
    required : true , 
  },
  avatar : {
    type : String ,
    default : "https://www.gravatar.com/avatar/?d=mp" 
  },
  token : {
    type : String ,
  },
  isVerified : {
    type : Boolean ,
    default : false
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
})

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
  next();
}); 

module.exports = mongoose.model('User',userSchema);