import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, 
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
})

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        unique: true, 
    },
    items: [cartItemSchema], 
    total: {
        type: Number,
        default: 0, 
        min: 0, 
    },
});

export const Cart = mongoose.model('Cart', cartSchema);

