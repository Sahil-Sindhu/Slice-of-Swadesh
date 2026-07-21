import { Router } from 'express';
import { createOrder, getOrderHistory, getOrderById, updateOrderStatus, getKitchenQueue, getAllOrders, getOrderTimeline } from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../dto/order.dto';

const router = Router();

router.get('/', authenticate, getAllOrders);
router.post('/', authenticate, validateBody(createOrderSchema), createOrder);
router.get('/history', authenticate, getOrderHistory);
router.get('/kitchen', authenticate, getKitchenQueue);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, validateBody(updateOrderStatusSchema), updateOrderStatus);
router.get('/:id/timeline', authenticate, getOrderTimeline);

export default router;
