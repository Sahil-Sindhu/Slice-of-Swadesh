import apiClient from '@/lib/api/interceptors';
import type { ApiSuccess } from '@/features/auth/types/auth.types';

export interface ApiPayment {
  _id: string;
  paymentId: string;
  orderId: string;
  gateway: string;
  amount: number;
  currency: string;
  status: string;
  failureReason?: string;
  createdAt: string;
}

export const getPaymentById = async (id: string): Promise<ApiPayment> => {
  const { data } = await apiClient.get<ApiSuccess<ApiPayment>>(`/api/v1/payments/${id}`);
  return data.data;
};

export const getAllPayments = async (filters: any = {}): Promise<{ payments: ApiPayment[], pagination: any }> => {
  // In a real app we'd pass filters to backend, mock for now since no GET /all API was made in sprint 1
  // Wait, I didn't create a GET /all payments API! 
  // Let me just fetch it or we can add it to backend if needed.
  // Actually, I'll add it to the backend `payment.routes.ts` in a second.
  const query = new URLSearchParams(filters).toString();
  const { data } = await apiClient.get<ApiSuccess<{ payments: ApiPayment[], pagination: any }>>(`/api/v1/payments?${query}`);
  return data.data;
};

export const verifyPayment = async (paymentId: string, simulateFailure = false): Promise<ApiPayment> => {
  const { data } = await apiClient.post<ApiSuccess<ApiPayment>>('/api/v1/payments/verify', {
    paymentId,
    gatewayData: { simulateFailure }
  });
  return data.data;
};

export const retryPayment = async (paymentId: string): Promise<{ payment: ApiPayment }> => {
  const { data } = await apiClient.post<ApiSuccess<{ payment: ApiPayment }>>('/api/v1/payments/retry', {
    paymentId
  });
  return data.data;
};

export const cancelPayment = async (paymentId: string): Promise<ApiPayment> => {
  const { data } = await apiClient.post<ApiSuccess<ApiPayment>>('/api/v1/payments/cancel', {
    paymentId,
    reason: "User cancelled from checkout"
  });
  return data.data;
};

export const refundPayment = async (paymentId: string, amount?: number): Promise<ApiPayment> => {
  const { data } = await apiClient.post<ApiSuccess<ApiPayment>>('/api/v1/payments/refund', {
    paymentId,
    amount
  });
  return data.data;
};
