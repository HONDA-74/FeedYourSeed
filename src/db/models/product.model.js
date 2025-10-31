import { Schema , model } from "mongoose";
import { defaultImage } from "../../utils/global-variables.js";
const productSchema = new Schema({
    name: { type: String, required: [true , "name is required"] , null : false},
    details: {type: String , required: [true , "details are required"], null : false},
    price: {type: Number , required: [true , "price is required"], null:false},
    sold: {type: Boolean ,default : false , null:false},
    quantity: { type: Number, required: [true, "quantity is required"], min: [0, "quantity cannot be negative"] , null:false  },
    image : { 
        secure_url : {type : String } ,
        public_id : {type : String }
    },
},
{
    timestamps:true
})
export const Product = model("Product" , productSchema )