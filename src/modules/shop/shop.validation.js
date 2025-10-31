import joi from "joi"

export const plantSchema = joi.object({
    name : joi.string().min(2).required(),
    price : joi.number().positive().required(),
    quantity : joi.number().integer().min(0).required(),
    details : joi.string().required()
}).required()

export const searchSchema = joi.object({
    name : joi.string().required()
}).required()

export const deleteSchema = joi.object({
    name : joi.string().required()
}).required()

export const addToCartSchema = joi.object({
    productId: joi.string().hex().length(24).required(),
    quantity: joi.number().integer().min(1)
}).required()

export const updatetSchema = joi.object({
    name : joi.string().min(2),
    price : joi.number().positive(),
    quantity : joi.number().integer().min(0),
    details : joi.string()
}).required()