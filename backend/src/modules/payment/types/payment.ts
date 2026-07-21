import { PaymentStatus, PaymentGatewayEnum } from "../constants/payment";

export interface IPayment {
  _id?: string;
  paymentId: string;
  orderId: string;
  customerId?: string;
  gateway: PaymentGatewayEnum;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId?: string;
  receipt?: string;
  notes?: string;
  failureReason?: string;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
