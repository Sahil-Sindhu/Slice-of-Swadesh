export interface IOrderItem {
  foodName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string | Date;
}
