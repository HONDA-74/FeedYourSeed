import joi from "joi";
import { generalFields } from "../../utils/global-variables.js";

export const orderSchema = joi.object({
    shippingAddress: joi.string().required(),
    paymentMethod: joi.string().valid('cash_on_delivery', 'credit_card').required(),
    creditCardInfo: joi.when('paymentMethod', {
        is: 'credit_card',
        then: joi.object({
            cardNumber: joi.string().creditCard().required(),
            cvc: joi.string().required(),
            expiryDate: joi.string().required(),
        }),
    }),
}).required()

export const orderIdSchema = joi.object({
    orderId : generalFields.id.required()
}).required()



