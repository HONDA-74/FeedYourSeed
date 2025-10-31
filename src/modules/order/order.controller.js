import express from 'express';
import * as orderService from "./order.service.js" 
import { authenticate } from '../../middlewares/auth.middleware.js';
import { isAuthorized } from '../../middlewares/authorization.middleware.js';
import { roles } from '../../utils/global-variables.js';
import { validation } from '../../middlewares/validation.middleware.js';
import { asyncHandler } from '../../utils/index.js';
import { orderIdSchema, orderSchema } from './order.validation.js';


const router = express.Router();
console.log(roles.USER);

router.post('/', authenticate , isAuthorized(roles.USER , roles.ADMIN) , validation(orderSchema) , asyncHandler(orderService.createOrder) );
router.get('/mine', authenticate , isAuthorized(roles.USER) ,asyncHandler(orderService.getMyOrders)  );
router.get('/:orderId', authenticate , isAuthorized(roles.USER) , validation(orderIdSchema) , asyncHandler(orderService.getOrderById) );
router.patch('/cancel/:orderId', authenticate , isAuthorized(roles.USER) , asyncHandler(orderService.cancelOrder ));
router.post("/checkout" , authenticate , isAuthorized() , validation() , asyncHandler(orderService))

// Admin routes
router.get('/allOrders', authenticate , isAuthorized(roles.ADMIN) , asyncHandler(orderService.getAllOrders) );
router.patch('/:orderId', authenticate , isAuthorized(roles.ADMIN) , validation(orderIdSchema) , asyncHandler(orderService.updateOrderStatus));
router.delete('/:orderId', authenticate , isAuthorized(roles.ADMIN) , validation(orderIdSchema) , asyncHandler(orderService.deleteOrder ));

export default router;
