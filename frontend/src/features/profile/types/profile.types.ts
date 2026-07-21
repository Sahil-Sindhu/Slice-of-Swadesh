import type { ApiUser } from '@/features/auth/types/auth.types';

export interface ProfileUpdatePayload {
  name?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface OrderItemSummary {
  foodName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderSummary {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  grandTotal: number;
  subtotal: number;
  discount: number;
  tax: number;
  items: OrderItemSummary[];
  createdAt: string;
  updatedAt?: string;
  customer?: ApiUser | string;
  notes?: string;
}

export interface OrderTimelineEntry {
  _id: string;
  oldStatus?: string | null;
  newStatus: string;
  remarks?: string;
  createdAt: string;
}
