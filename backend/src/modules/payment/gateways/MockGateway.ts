import { PaymentGateway } from "./PaymentGateway";
import { IPaymentDocument } from "../models/Payment";
import { logger } from "../../../utils/logger";

export class MockGateway implements PaymentGateway {
  
  async createPayment(payment: IPaymentDocument): Promise<any> {
    // Return a mock redirect URL or mock transaction ID
    return {
      success: true,
      mock_payment_id: `mock_pay_${Date.now()}_${payment.orderId}`,
      message: "Mock payment intent created. Proceed to verify endpoint to simulate success.",
      redirect_url: `/api/v1/payments/mock-redirect?paymentId=${payment.paymentId}`
    };
  }

  async verifyPayment(paymentId: string, signature?: string, gatewayData?: any): Promise<boolean> {
    // In Mock, we can simulate failure by passing a specific mock flag in gatewayData
    if (gatewayData?.simulateFailure) {
      return false;
    }
    return true; // default to success simulation
  }

  async capturePayment(payment: IPaymentDocument): Promise<void> {
    // Mock capture action
    logger.info(`[MockGateway] Capturing payment ${payment.paymentId}`, { service: 'payment' });
  }

  async refundPayment(payment: IPaymentDocument, amount?: number, notes?: string): Promise<void> {
    // Mock refund action
    logger.info(`[MockGateway] Refunding payment ${payment.paymentId} for amount ${amount || payment.amount}. Notes: ${notes}`, { service: 'payment' });
  }

  async cancelPayment(payment: IPaymentDocument, reason?: string): Promise<void> {
    // Mock cancel action
    logger.info(`[MockGateway] Cancelling payment ${payment.paymentId}. Reason: ${reason}`, { service: 'payment' });
  }
}
