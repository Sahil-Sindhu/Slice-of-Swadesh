import apiClient from '@/lib/api/interceptors';
import type { ApiCart, AddToCartPayload } from '../types/cart.types';
import type { ApiSuccess } from '@/features/auth/types/auth.types';

export const getCart = async (): Promise<ApiCart> => {
  const { data } = await apiClient.get<ApiSuccess<{ cart: ApiCart }>>('/api/v1/cart');
  return data.data.cart;
};

export const addToCart = async (payload: AddToCartPayload): Promise<ApiCart> => {
  const { data } = await apiClient.post<ApiSuccess<{ cart: ApiCart }>>('/api/v1/cart/add', payload);
  return data.data.cart;
};

export const updateCartItem = async (itemId: string, quantity: number): Promise<ApiCart> => {
  const { data } = await apiClient.patch<ApiSuccess<{ cart: ApiCart }>>(`/api/v1/cart/item/${itemId}`, { quantity });
  return data.data.cart;
};

export const removeCartItem = async (itemId: string): Promise<ApiCart> => {
  const { data } = await apiClient.delete<ApiSuccess<{ cart: ApiCart }>>(`/api/v1/cart/item/${itemId}`);
  return data.data.cart;
};

export const clearCart = async (): Promise<ApiCart> => {
  const { data } = await apiClient.delete<ApiSuccess<{ cart: ApiCart }>>('/api/v1/cart/clear');
  return data.data.cart;
};

export interface CheckoutResult {
  orderNumber: string;
  grandTotal: number;
  paymentStatus: string;
  status: string;
  paymentIntent?: any;
}

export const checkout = async (): Promise<CheckoutResult> => {
  const { data } = await apiClient.post<ApiSuccess<CheckoutResult>>('/api/v1/cart/checkout');
  return data.data;
};

