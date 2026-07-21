import apiClient from '@/lib/api/interceptors';
import type { ApiSuccess, ApiUser } from '@/features/auth/types/auth.types';
import type { OrderSummary, OrderTimelineEntry, ProfileUpdatePayload } from '../types/profile.types';

export const getProfile = async (): Promise<ApiUser> => {
  const { data } = await apiClient.get<ApiSuccess<{ user: ApiUser }>>('/api/v1/auth/profile');
  return data.data.user;
};

export const updateProfile = async (payload: ProfileUpdatePayload): Promise<ApiUser> => {
  const { data } = await apiClient.put<ApiSuccess<{ user: ApiUser }>>('/api/v1/auth/profile', payload);
  return data.data.user;
};

export const getOrderHistory = async (): Promise<OrderSummary[]> => {
  const { data } = await apiClient.get<ApiSuccess<{ orders: OrderSummary[] }>>('/api/v1/orders/history');
  return data.data.orders;
};

export const getOrderById = async (orderId: string): Promise<OrderSummary> => {
  const { data } = await apiClient.get<ApiSuccess<{ order: OrderSummary }>>(`/api/v1/orders/${orderId}`);
  return data.data.order;
};

export const getOrderTimeline = async (orderId: string): Promise<OrderTimelineEntry[]> => {
  const { data } = await apiClient.get<ApiSuccess<{ timeline: OrderTimelineEntry[] }>>(`/api/v1/orders/${orderId}/timeline`);
  return data.data.timeline;
};
