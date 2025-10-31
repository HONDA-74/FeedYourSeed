import { Product } from '../../db/models/product.model.js';
import { Cart } from '../../db/models/cart.model.js';
import { Order } from '../../db/models/order.model.js';
import { messages } from '../../utils/index.js';
import { orderStatus } from '../../utils/global-variables.js';

// CREATE Order (From Cart)
export const createOrder = async (req, res, next) => {
  const userId = req.existUser._id;
  const {
    shippingAddress,
    paymentMethod = 'cash_on_delivery',
    creditCardInfo // Optional: { cardNumber, cvc, expiryDate }
  } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    return next(new Error(messages.cart.empty || 'Cart is empty', { cause: 400 }));
  }

  const orderData = {
    userId,
    items: cart.items,
    total: cart.total,
    shippingAddress,
    paymentMethod,
    };

  if (paymentMethod === 'credit_card') {
    if (!creditCardInfo || !creditCardInfo.cardNumber || !creditCardInfo.cvc || !creditCardInfo.expiryDate) {
      return next(new Error('Missing credit card information', { cause: 400 }));
    }

    // Note: Never store real card data in plaintext in production!
    orderData.creditCardInfo = {
      cardNumber: creditCardInfo.cardNumber,
      cvc: creditCardInfo.cvc,
      expiryDate: creditCardInfo.expiryDate,
    };
  }

  const order = new Order(orderData);
  await order.save();

  cart.items = [];
  cart.total = 0;
  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order,
  });
};


// GET All Orders for Admin
export const getAllOrders = async (req, res, next) => {
    const orders = await Order.find().populate('userId', 'name email').populate('items.productId', 'name');
    res.status(200).json({ success: true, orders });
};

// GET My Orders
export const getMyOrders = async (req, res, next) => {
    const userId = req.existUser._id;
    const orders = await Order.find({ userId }).populate('items.productId', 'name');
    res.status(200).json({ success: true, orders });
};

// GET Single Order by ID
export const getOrderById = async (req, res, next) => {
    const order = await Order.findById(req.params.orderId).populate('items.productId', 'name');
    if (!order) {
        return next(new Error(messages.order.notFound || 'Order not found', { cause: 404 }));
    }
    res.status(200).json({ success: true, order });
};

// UPDATE Order Status (Admin)
export const updateOrderStatus = async (req, res, next) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        return next(new Error(messages.order.notFound || 'Order not found', { cause: 404 }));
    }

    order.status = status;
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order status updated',
        order,
    });
};

// DELETE Order (optional, e.g., for admin/testing)
export const deleteOrder = async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
        return next(new Error(messages.order.notFound || 'Order not found', { cause: 404 }));
    }
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
};

// CANCEL Order (User)
export const cancelOrder = async (req, res, next) => {
    const userId = req.existUser._id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        return next(new Error(messages.order.notFound || 'Order not found', { cause: 404 }));
    }

    // Check if the user owns the order
    if (order.userId.toString() !== userId.toString()) {
        return next(new Error('You are not authorized to cancel this order', { cause: 403 }));
    }

    // Only allow cancellation if order is still pending or processing
    if (![orderStatus.PENDING , orderStatus.PROCESSING ].includes(order.status)) {
        return next(new Error('Order cannot be cancelled at this stage', { cause: 400 }));
    }

    order.status = orderStatus.CANCELLED;
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order,
    });
};

