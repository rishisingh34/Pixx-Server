const joi = require('joi');

const registerSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
})

module.exports = registerSchema;