import { Cart } from "../../db/models/cart.model.js";
import { Product } from "../../db/models/product.model.js";
import cloudinary from "../../utils/file upload/cloud-config.js";
import { messages } from "../../utils/index.js";

export const getProducts = async (req, res, next) => {
    const products = await Product.find()

    if(!products) return next(new Error("There is no more products. " , {cause : 400}))

    res.status(200).json({
        success: true,
        products,
    })
}

export const getProduct = async (req, res, next) => {
    console.log(req.params.id)
    const product = await Product.findById(req.params.id)

    if(!product) return next(new Error(messages.Product.notFound , {cause : 400}))

    res.status(200).json({
        success: true,
        product,
    })
} 

export const addProduct = async (req,res,next) => {
        const { name , price , quantity , details }= req.body

        const { secure_url , public_id } = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder : `feed_your_seed/products/${name}`
            }
        )

        const createdProduct =await Product.create(
            {
                name ,
                price , 
                quantity , 
                details ,
                "image.secure_url" : secure_url ,
                "image.public_id" : public_id
            }
        )

        res.status(201).json({
            success: true,
            message: messages.Product.Created,
            createdProduct,
        })
}

export const search = async (req, res, next) => {
        const { name } = req.body
        const product = await Product.find({ name: { $regex: name, $options: "i" } })
        if (!product) {
            return next(new Error(messages.Product.notFound , {cause : 400}))
        }
        res.status(200).json({ success: true, product })
} 

export const deleteProduct = async (req,res,next) => {
    const { id } = req.body

    const deletedProduct =await Product.deleteOne({ _id : id }) 

    if (deletedProduct.deletedCount == 0) return next(new Error(messages.Product.notFound , { cause: 404 }));

    res.status(201).json({
        success: true,
        message: 'Note created successfully',
        deletedProduct,
    })

}

export const updateProduct = async (req,res,next) => {
    const { id } = req.params
    const { name, price, quantity, details } = req.body

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (details !== undefined) updateData.details = details;

    const updatedProdcut = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true } 
    )

    if (!updatedProdcut) {
        return next(new Error(messages.Product.notFound , {cause : 404}));
    }

    res.status(200).json({
        success: true,
        message: 'Plant updated successfully',
        updatedProdcut,
    })
}

export const addToCart = async (req , res , next ) => {
    const userId  = req.existUser._id
    const { productId, quantity = 1 } = req.body

    const product = await Product.findById(productId);
    if (!product) {
        console.log("here");
        
        return next(new Error(messages.Product.notFound ,{cause : 404}));
    }

    let cart = await Cart.findOne({ userId })
    if (!cart) {
        cart = new Cart({
            userId,
            items: [],
            total: 0,
            })
    }
    // Check if the plant is already in the cart
    const cartItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    )

    if (cartItemIndex !== -1) {
        // If the plant is already in the cart, update the quantity
        cart.items[cartItemIndex].quantity += quantity;
    } else {
        // If the plant is not in the cart, add it as a new item
        cart.items.push({
            productId,
            quantity,
            price: product.price, // Store the current price of the plant
        })
    }
    // Update the total price of the cart
    cart.total = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    )

    await cart.save();

    res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        cart,
    })
}

export const getCart = async (req, res, next) => {
    const userId = req.existUser._id;

    let userCart = await Cart.findOne({ userId }).populate("items.productId");

    if (!userCart) {
        // Create a new empty cart for the user
        userCart = new Cart({
            userId,
            items: [],
            total: 0,
        });
        await userCart.save();

        // Optional: Populate even if empty for consistency
        userCart = await Cart.findById(userCart._id).populate("items.productId");
    }

    res.status(200).json({
        success: true,
        userCart,
    });
};


export const removeFromCart = async (req, res, next) => {
    const userId = req.existUser._id;
    const { productId, quantity = 1 } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return next(new Error(messages.cart.notFound, { cause: 404 }));
    }

    const cartItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );
    

    if (cartItemIndex === -1) {
        return next(new Error(messages.cart.itemNotFound || 'Item not found in cart', { cause: 404 }));
    }

    const cartItem = cart.items[cartItemIndex];

    if (cartItem.quantity > quantity) {
        cartItem.quantity -= quantity;
    } else {
        cart.items.splice(cartItemIndex, 1);
    }

    // Recalculate total
    cart.total = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    await cart.save();

    res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        cart,
    });
}
