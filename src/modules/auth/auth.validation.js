import joi from "joi"


export const signupSchema = joi.object({
    first_name : joi.string().required(),
    last_name : joi.string().required(),
    email : joi.string().email().required(),
    password : joi.string().min(6).required(),
    // cPassword : joi.string().valid(joi.ref("password")).min(6).required(),
    age : joi.number().required(),
    phone : joi.string().required(),
    address : joi.string().required()
}).required() 

export const loginSchema = joi.object({
    email : joi.string().email().required(),
    password : joi.string().min(6).required(),
}).required()

export const otpSchema = joi.object({
    email : joi.string().email().required(),
}).required()

export const forgetPasswordSchema = joi.object({
    email : joi.string().email().required(),
}).required() 

export const resetPasswordSchema = joi.object({
    email : joi.string().email().required(),
    otp : joi.string().length(5).required(),
    password : joi.string().min(6).required(),
    // cPassword : joi.string().valid(joi.ref("password")).min(6).required(),
}).required() 