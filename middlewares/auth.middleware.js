const {ACCESS_TOKEN_SECRET} = require('../config/env.config');
const jwt = require("jsonwebtoken");
const User = require('../models/user.model');

const signToken = (id) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "365d",
      issuer: "pixx",
      audience: id,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

const auth = async (req, res, next) => {
  try {
    
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Missing token" });
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    req.user  = await User.findById(decoded.aud).select("-passwd");
    

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { auth , signToken};