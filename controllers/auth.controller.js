const User = require('../models/user.model');
const registerSchema = require('../utils/validation.util');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/mailer.util');
const { baseUrl } = require('../config/env.config');
const crypto = require('crypto');
const { signToken } = require('../middlewares/auth.middleware');

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if(error) return res.status(400).json({ error : error.details[0].message });
    const userExists = await User.findOne({ email : req.body.email });
    if(userExists) return res.status(400).json({ error : "User already exists" });
    
    const token = crypto.randomBytes(16).toString('hex');
    const newUser = new User({
      ...req.body,
      token
    });
    await newUser.save();

    sendMail(`${baseUrl}/auth/verifyEmail?token=${token}&u=${newUser.id}`,newUser.username,newUser.email);

    return res.status(201).json({ message : "User created, Verfiy Email"  });
  } catch (err) {
    return res.status(500).json({ error: err.message });    
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user) return res.status(400).json({ error : "User does not Exist" });
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.status(400).json({ error : "Invalid credentials" });

    if(!user.isVerified) return res.status(400).json({ error : "Please verify your Email" });

    const token = await signToken(user.id);
    return res.status(200).json({ message  : "Login successful", token : token  });

  } catch (err) {
    return res.status(500).json({ error: err.message });    
  }
}

const verify = async (req, res) => {
  try {
    const { token, u } = req.query;
    if (!token || !u) { return res.status(400).json({ error: "Invalid request lauda" });  }
    const user = await User.findOneAndUpdate(
      { _id: u, token }, 
      { $set: { isVerified: true }, $unset: { token: "" } }, 
      { new: true } 
    );

    if (!user) { return res.status(400).json({ error: "Invalid request lahsan" });  }

    return res.redirect(`${baseUrl}/auth/emailVerified`);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const emailVerified = async (req, res)=> {
  try {
    return res.render('emailVerified', { message: 'Your email has been successfully verified!' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  verify ,
  emailVerified
}