import apiClient from '../../../../lib/api/client';
import { IOrder } from '../types/order.types';

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
}

export interface PaginatedOrders {
  orders: IOrder[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface OrderTimelineEvent {
  _id: string;
  order: string;
  status: string;
  remarks?: string;
  updatedBy?: string;
  createdAt: string;
}

export const AdminOrdersAPI = {
  getAllOrders: async (params: GetOrdersParams): Promise<PaginatedOrders> => {
    const { data } = await apiClient.get('/api/v1/orders', { params });
    return data.data;
  },

  getKitchenQueue: async (): Promise<IOrder[]> => {
    const { data } = await apiClient.get('/api/v1/orders/kitchen');
    return data.data.orders;
  },

  getOrderById: async (id: string): Promise<IOrder> => {
    const { data } = await apiClient.get(`/api/v1/orders/${id}`);
    return data.data.order;
  },

  getOrderTimeline: async (id: string): Promise<OrderTimelineEvent[]> => {
    const { data } = await apiClient.get(`/api/v1/orders/${id}/timeline`);
    return data.data.timeline;
  },

  updateOrderStatus: async (id: string, status: string, remarks?: string): Promise<IOrder> => {
    const { data } = await apiClient.patch(`/api/v1/orders/${id}/status`, { status, remarks });
    return data.data.order;
  }
};
