import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Inventory } from '../models/Inventory';
import { Ingredient } from '../models/Ingredient';
import { sendSuccess } from '../utils/response';
import { handleError } from '../utils/errorHandler';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // 1. Orders Count
    const todaysOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startOfToday },
      isDeleted: false
    });
    const yesterdaysOrdersCount = await Order.countDocuments({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
      isDeleted: false
    });

    const ordersChange = yesterdaysOrdersCount > 0 
      ? Math.round(((todaysOrdersCount - yesterdaysOrdersCount) / yesterdaysOrdersCount) * 100) 
      : 0;

    // 2. Revenue calculation
    const todaysOrders = await Order.find({
      createdAt: { $gte: startOfToday },
      isDeleted: false,
      paymentStatus: 'Paid'
    });
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const yesterdaysOrders = await Order.find({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
      isDeleted: false,
      paymentStatus: 'Paid'
    });
    const yesterdaysRevenue = yesterdaysOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const revenueChange = yesterdaysRevenue > 0
      ? Math.round(((todaysRevenue - yesterdaysRevenue) / yesterdaysRevenue) * 100)
      : 0;

    // 3. Pending Orders
    const pendingOrdersCount = await Order.countDocuments({
      status: { $in: ['Pending', 'Confirmed', 'Preparing'] },
      isDeleted: false
    });

    // 4. Low stock count
    const inventories = await Inventory.find({ isDeleted: false }).populate('ingredient');
    let lowStockCount = 0;
    for (const inv of inventories) {
      const ing = inv.ingredient as any;
      if (ing && inv.currentStock <= (ing.minimumStock || 0)) {
        lowStockCount++;
      }
    }

    // 5. Active Customers
    const activeCustomersCount = await User.countDocuments({ role: 'customer', isDeleted: false });

    // 6. Kitchen Status
    const kitchenStatus = pendingOrdersCount > 5 ? 'Busy' : (pendingOrdersCount > 0 ? 'Active' : 'Idle');

    return sendSuccess(res, 'Stats retrieved successfully', {
      todaysOrders: { value: todaysOrdersCount, trend: ordersChange, isPositive: ordersChange >= 0 },
      todaysRevenue: { value: todaysRevenue, trend: revenueChange, isPositive: revenueChange >= 0 },
      pendingOrders: { value: pendingOrdersCount },
      lowStockItems: { value: lowStockCount, trend: 0, isPositive: true },
      activeCustomers: { value: activeCustomersCount },
      kitchenStatus
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getRevenueAnalytics = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      isDeleted: false,
      paymentStatus: 'Paid'
    }).sort({ createdAt: 1 });

    // Group by date
    const revenueMap: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      revenueMap[dateStr] = 0;
    }

    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (revenueMap[dateStr] !== undefined) {
        revenueMap[dateStr] += order.grandTotal;
      }
    });

    const result = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue
    })).sort((a, b) => a.date.localeCompare(b.date));

    return sendSuccess(res, 'Revenue analytics retrieved successfully', result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customer', 'name email');

    const result = orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      customerName: (order.customer as any)?.name || 'Guest Customer',
      grandTotal: order.grandTotal,
      status: order.status,
      createdAt: order.createdAt.toISOString()
    }));

    return sendSuccess(res, 'Recent orders retrieved successfully', result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const inventories = await Inventory.find({ isDeleted: false }).populate('ingredient');
    const result: any[] = [];

    for (const inv of inventories) {
      const ing = inv.ingredient as any;
      if (ing && inv.currentStock <= (ing.minimumStock || 0)) {
        result.push({
          id: inv._id,
          name: ing.name,
          currentStock: inv.currentStock,
          minStock: ing.minimumStock,
          unit: ing.unit
        });
      }
    }

    return sendSuccess(res, 'Low stock items retrieved successfully', result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getBestSellingFoods = async (req: Request, res: Response) => {
  try {
    const startOfTime = new Date(0); // Query all-time best sellers
    const orders = await Order.find({ isDeleted: false, paymentStatus: 'Paid', createdAt: { $gte: startOfTime } });

    const salesMap: Record<string, { qty: number, rev: number }> = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!salesMap[item.foodName]) {
          salesMap[item.foodName] = { qty: 0, rev: 0 };
        }
        salesMap[item.foodName].qty += item.quantity;
        salesMap[item.foodName].rev += item.totalPrice;
      });
    });

    const result = Object.entries(salesMap).map(([name, data]) => ({
      foodId: name,
      name,
      orders: data.qty,
      revenue: data.rev
    })).sort((a, b) => b.orders - a.orders).slice(0, 5);

    return sendSuccess(res, 'Best sellers retrieved successfully', result);
  } catch (error) {
    return handleError(res, error);
  }
};
