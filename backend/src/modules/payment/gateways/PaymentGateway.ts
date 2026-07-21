import { IPaymentDocument } from "../models/Payment";

export interface PaymentGateway {
  /**
   * Initializes a new payment intent with the provider.
   * Returns gateway-specific data (e.g. order_id for Razorpay or mock redirect url).
   */
  createPayment(payment: IPaymentDocument): Promise<any>;

  /**
   * Verifies the payment authenticity from the provider (e.g. webhook signature check).
   * Returns boolean representing validity.
   */
  verifyPayment(paymentId: string, signature?: string, gatewayData?: any): Promise<boolean>;

  /**
   * Instructs the provider to capture an authorized payment.
   */
  capturePayment(payment: IPaymentDocument): Promise<void>;

  /**
   * Refunds a captured payment partially or fully.
   */
  refundPayment(payment: IPaymentDocument, amount?: number, notes?: string): Promise<void>;

  /**
   * Cancels a pending or created payment.
   */
  cancelPayment(payment: IPaymentDocument, reason?: string): Promise<void>;
}
