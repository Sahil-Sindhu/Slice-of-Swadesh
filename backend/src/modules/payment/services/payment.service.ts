import { PaymentGateway } from "../gateways/PaymentGateway";
import { MockGateway } from "../gateways/MockGateway";
import { RazorpayGateway } from "../gateways/RazorpayGateway";
import { Payment, IPaymentDocument } from "../models/Payment";
import { IPayment } from "../types/payment";
import { PaymentStatus, PaymentGatewayEnum } from "../constants/payment";
import { Order } from "../../../models/Order";
import { OrderService } from "../../../services/orderService";
import { NotFoundError } from "../../../errors/NotFoundError";
import { ValidationError } from "../../../errors/ValidationError";
import mongoose from "mongoose";
import { logger } from "../../../utils/logger";
import { NotificationService } from "../../notification/services/notification.service";
import { NotificationType, NotificationChannel } from "../../notification/constants/notification";

export class PaymentService {
  private static getGateway(): PaymentGateway {
    const gatewayType = process.env.PAYMENT_GATEWAY || "mock";
    if (gatewayType.toLowerCase() === "razorpay") {
      return new RazorpayGateway();
    }
    return new MockGateway();
  }

  static async createPayment(orderId: string, customerId?: string, session?: mongoose.ClientSession): Promise<any> {
    const order = await Order.findOne({ orderNumber: orderId, isDeleted: { $ne: true } }).session(session || null);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.status !== "Pending") {
      throw new ValidationError("Order is no longer pending.");
    }

    const gatewayType = process.env.PAYMENT_GATEWAY?.toUpperCase() === "RAZORPAY" 
      ? PaymentGatewayEnum.RAZORPAY 
      : PaymentGatewayEnum.MOCK;

    // Create Payment Record
    const paymentId = `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const [payment] = await Payment.create([{
      paymentId,
      orderId: order.orderNumber,
      customerId,
      gateway: gatewayType,
      amount: order.grandTotal,
      currency: "INR",
      status: PaymentStatus.CREATED
    }], { session });

    const gateway = this.getGateway();
    const gatewayResponse = await gateway.createPayment(payment);

    return {
      payment: payment.toJSON(),
      gatewayResponse
    };
  }

  static async verifyPayment(paymentId: string, signature?: string, gatewayData?: any): Promise<IPayment> {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) throw new NotFoundError("Payment not found");

    const gateway = this.getGateway();
    const isValid = await gateway.verifyPayment(paymentId, signature, gatewayData);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (isValid) {
        payment.status = PaymentStatus.CAPTURED;
        payment.paidAt = new Date();
        await payment.save({ session });
        
        // Use the new confirmOrder method in OrderService (we will write this in Sprint 4)
        await OrderService.confirmOrder(payment.orderId, session);
      } else {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = gatewayData?.reason || "Verification failed";
        await payment.save({ session });
        
        // Handle failed payment order status (e.g., leave as pending but set paymentStatus to failed)
        await OrderService.handlePaymentFailure(payment.orderId, session);
      }
      
      await session.commitTransaction();

      // Fire Notifications
      if (payment.customerId) {
        if (isValid) {
          NotificationService.send({
            userId: payment.customerId,
            type: NotificationType.PAYMENT_SUCCESS,
            channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
            title: "Payment Successful",
            message: `Your payment of ₹${payment.amount} for order ${payment.orderId} was successful.`,
            metadata: { paymentId, orderId: payment.orderId, amount: payment.amount },
            emailTemplate: "paymentSuccess"
          }).catch(err => logger.error("Notification failed", { error: err.message }));
        } else {
          NotificationService.send({
            userId: payment.customerId,
            type: NotificationType.PAYMENT_FAILED,
            channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
            title: "Payment Failed",
            message: `Your payment of ₹${payment.amount} for order ${payment.orderId} failed.`,
            metadata: { paymentId, orderId: payment.orderId, amount: payment.amount },
            emailTemplate: "paymentFailed"
          }).catch(err => logger.error("Notification failed", { error: err.message }));
        }
      }

      return payment.toJSON();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getPaymentById(id: string): Promise<IPayment> {
    const payment = await Payment.findOne({ paymentId: id });
    if (!payment) throw new NotFoundError("Payment not found");
    return payment.toJSON();
  }

  static async getAllPayments(filters: any): Promise<{ payments: IPayment[], pagination: any }> {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.gateway) query.gateway = filters.gateway;
    
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 15;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Payment.countDocuments(query)
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getPaymentByOrderId(orderId: string): Promise<IPayment[]> {
    return await Payment.find({ orderId }).lean();
  }

  static async getCustomerPayments(customerId: string): Promise<IPayment[]> {
    return await Payment.find({ customerId }).sort({ createdAt: -1 }).lean();
  }

  static async retryPayment(paymentId: string): Promise<any> {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) throw new NotFoundError("Payment not found");
    
    if (payment.status !== PaymentStatus.FAILED && payment.status !== PaymentStatus.PENDING) {
      throw new ValidationError("Only failed or pending payments can be retried");
    }

    // Usually retry creates a new intent/payment record, or re-initiates the same one.
    // For simplicity, we re-call create on the gateway with the same payment record.
    const gateway = this.getGateway();
    const gatewayResponse = await gateway.createPayment(payment);

    return {
      payment: payment.toJSON(),
      gatewayResponse
    };
  }

  static async cancelPayment(paymentId: string, reason?: string): Promise<IPayment> {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) throw new NotFoundError("Payment not found");

    if (payment.status === PaymentStatus.CAPTURED) {
      throw new ValidationError("Cannot cancel a captured payment, use refund instead.");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const gateway = this.getGateway();
      await gateway.cancelPayment(payment, reason);

      payment.status = PaymentStatus.CANCELLED;
      await payment.save({ session });

      await OrderService.cancelOrder(payment.orderId, "Payment Cancelled", session);

      await session.commitTransaction();
      return payment.toJSON();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async refundPayment(paymentId: string, amount?: number, notes?: string): Promise<IPayment> {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) throw new NotFoundError("Payment not found");

    if (payment.status !== PaymentStatus.CAPTURED && payment.status !== PaymentStatus.PARTIALLY_REFUNDED) {
      throw new ValidationError("Only captured payments can be refunded");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const gateway = this.getGateway();
      await gateway.refundPayment(payment, amount, notes);

      // Simple implementation assuming full refund if no amount specified or amounts match
      if (!amount || amount >= payment.amount) {
        payment.status = PaymentStatus.REFUNDED;
      } else {
        payment.status = PaymentStatus.PARTIALLY_REFUNDED;
      }
      await payment.save({ session });

      // Update Order Status via OrderService
      await OrderService.handlePaymentRefund(payment.orderId, session);

      await session.commitTransaction();

      if (payment.customerId) {
        NotificationService.send({
          userId: payment.customerId,
          type: NotificationType.REFUND_SUCCESS,
          channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
          title: "Refund Processed",
          message: `A refund of ₹${amount || payment.amount} for order ${payment.orderId} has been initiated.`,
          metadata: { paymentId, orderId: payment.orderId }
        }).catch(err => logger.error("Notification failed", { error: err.message }));
      }

      return payment.toJSON();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
