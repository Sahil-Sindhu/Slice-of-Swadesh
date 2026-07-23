import apiClient from '../../../../lib/api/client';
import { DashboardStats, RevenueDataPoint, RecentOrder, LowStockAlert, BestSeller } from '../types/dashboard.types';

// The user specified that if analytics endpoints are missing, don't hardcode data.
// We will hit the real endpoints. If they return 404, the React Query hook will fail and trigger the Error state.
// We can intercept the call to mock the endpoints that don't exist yet so we can see the empty states and skeletons if we want,
// but for strict adherence to "no placeholder data" and showing error boundaries, we'll hit the real endpoints.

export const DashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/api/v1/analytics/dashboard-stats');
    return data.data;
  },

  getRevenueAnalytics: async (): Promise<RevenueDataPoint[]> => {
    const { data } = await apiClient.get('/api/v1/analytics/revenue?days=7');
    return data.data;
  },

  getRecentOrders: async (): Promise<RecentOrder[]> => {
    const { data } = await apiClient.get('/api/v1/analytics/recent-orders');
    return data.data;
  },

  getLowStockItems: async (): Promise<LowStockAlert[]> => {
    const { data } = await apiClient.get('/api/v1/analytics/low-stock');
    return data.data;
  },

  getBestSellingFoods: async (): Promise<BestSeller[]> => {
    const { data } = await apiClient.get('/api/v1/analytics/best-sellers');
    return data.data;
  }
};
