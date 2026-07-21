import { PaymentGateway } from "./PaymentGateway";
import { IPaymentDocument } from "../models/Payment";

export class RazorpayGateway implements PaymentGateway {
  
  async createPayment(payment: IPaymentDocument): Promise<any> {
    throw new Error("Razorpay integration is Not Implemented");
  }

  async verifyPayment(paymentId: string, signature?: string, gatewayData?: any): Promise<boolean> {
    throw new Error("Razorpay integration is Not Implemented");
  }

  async capturePayment(payment: IPaymentDocument): Promise<void> {
    throw new Error("Razorpay integration is Not Implemented");
  }

  async refundPayment(payment: IPaymentDocument, amount?: number, notes?: string): Promise<void> {
    throw new Error("Razorpay integration is Not Implemented");
  }

  async cancelPayment(payment: IPaymentDocument, reason?: string): Promise<void> {
    throw new Error("Razorpay integration is Not Implemented");
  }
}
