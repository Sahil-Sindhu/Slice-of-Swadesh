export interface DashboardStats {
  todaysOrders: { value: number; trend: number; isPositive: boolean };
  todaysRevenue: { value: number; trend: number; isPositive: boolean };
  pendingOrders: { value: number };
  lowStockItems: { value: number; trend: number; isPositive: boolean };
  activeCustomers: { value: number };
  kitchenStatus: 'Quiet' | 'Busy' | 'Overwhelmed';
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface RecentOrder {
  id: string; // Order Number
  customerName: string;
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
}

export interface LowStockAlert {
  ingredientId: string;
  name: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
}

export interface BestSeller {
  foodId: string;
  name: string;
  orders: number;
  revenue: number;
}
