import joi from "joi"


export const updateSchema = joi.object({
    first_name : joi.string(),
    last_name : joi.string(),
    email : joi.string().email(),
    age : joi.number().required(),
    phone : joi.string().required(),
    address : joi.string().required(), 
}).required() 


export const passwordUpdateSchema = joi.object({
    otp : joi.string().length(5).required(),
    password : joi.string().min(6).required(),
    // cPassword : joi.string().valid(joi.ref("password")).min(6).required(),
}).required() 
