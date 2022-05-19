const Joi = require('joi')

exports.addUserSchema = Joi.object({
    account: Joi.string().alphanum().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/).required()
}).unknown()