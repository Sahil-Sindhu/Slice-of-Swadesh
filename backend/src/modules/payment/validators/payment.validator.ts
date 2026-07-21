import { z } from "zod";

export const CreatePaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
});

export const VerifyPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  signature: z.string().optional(),
  gatewayData: z.any().optional(),
});

export const RefundPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  amount: z.number().optional(), // Optional for full refund
  notes: z.string().optional(),
});

export const RetryPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
});

export const CancelPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  reason: z.string().optional(),
});
