import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { AuthRequest } from "../../../middleware/auth";
import { sendSuccess } from "../../../utils/response";
import { handleError } from "../../../utils/errorHandler";

export class PaymentController {
  
  static async getAllPayments(req: Request, res: Response) {
    try {
      const filters = req.query;
      const result = await PaymentService.getAllPayments(filters);
      return sendSuccess(res, "Payments retrieved successfully", result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async createPayment(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.body;
      const payment = await PaymentService.createPayment(orderId, req.user?._id?.toString());
      return sendSuccess(res, "Payment created successfully", payment, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async verifyPayment(req: Request, res: Response) {
    try {
      const { paymentId, signature, gatewayData } = req.body;
      const payment = await PaymentService.verifyPayment(paymentId, signature, gatewayData);
      return sendSuccess(res, "Payment verified successfully", payment);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id);
      return sendSuccess(res, "Payment retrieved successfully", payment);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async getPaymentByOrderId(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const payments = await PaymentService.getPaymentByOrderId(orderId);
      return sendSuccess(res, "Payments retrieved successfully", payments);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async getCustomerPayments(req: AuthRequest, res: Response) {
    try {
      const customerId = req.user?._id?.toString();
      if (!customerId) throw new Error("Unauthorized");
      const payments = await PaymentService.getCustomerPayments(customerId);
      return sendSuccess(res, "Customer payments retrieved successfully", payments);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async retryPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.body;
      const payment = await PaymentService.retryPayment(paymentId);
      return sendSuccess(res, "Payment retried successfully", payment);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async cancelPayment(req: Request, res: Response) {
    try {
      const { paymentId, reason } = req.body;
      const payment = await PaymentService.cancelPayment(paymentId, reason);
      return sendSuccess(res, "Payment cancelled successfully", payment);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async refundPayment(req: Request, res: Response) {
    try {
      const { paymentId, amount, notes } = req.body;
      const payment = await PaymentService.refundPayment(paymentId, amount, notes);
      return sendSuccess(res, "Payment refunded successfully", payment);
    } catch (error) {
      return handleError(res, error);
    }
  }
}
