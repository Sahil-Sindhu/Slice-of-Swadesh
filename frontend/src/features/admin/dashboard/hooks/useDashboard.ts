import { useQuery } from '@tanstack/react-query';
import { DashboardAPI } from '../api/dashboard.api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: DashboardAPI.getStats,
    retry: 1,
    staleTime: 60 * 1000,
  });
};

export const useRevenueAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'revenue'],
    queryFn: DashboardAPI.getRevenueAnalytics,
    retry: 1,
    staleTime: 60 * 1000,
  });
};

export const useRecentOrders = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'recentOrders'],
    queryFn: DashboardAPI.getRecentOrders,
    retry: 1,
    staleTime: 60 * 1000,
  });
};

export const useLowStock = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'lowStock'],
    queryFn: DashboardAPI.getLowStockItems,
    retry: 1,
    staleTime: 60 * 1000,
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'bestSellers'],
    queryFn: DashboardAPI.getBestSellingFoods,
    retry: 1,
    staleTime: 60 * 1000,
  });
};
