import { Router } from 'express';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getRecentOrders,
  getLowStockItems,
  getBestSellingFoods,
} from '../controllers/analyticsController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// Secure analytics routes to admin/manager roles
router.use(authenticate, requireRoles(['admin', 'manager', 'superadmin']));

router.get('/dashboard-stats', getDashboardStats);
router.get('/revenue', getRevenueAnalytics);
router.get('/recent-orders', getRecentOrders);
router.get('/low-stock', getLowStockItems);
router.get('/best-sellers', getBestSellingFoods);

export default router;
