import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../../../middleware/auth";
import { validateBody } from "../../../middleware/validate";
import {
  CreatePaymentSchema,
  VerifyPaymentSchema,
  RefundPaymentSchema,
  RetryPaymentSchema,
  CancelPaymentSchema
} from "../validators/payment.validator";

const router = Router();

// Admin Get All Payments
router.get("/", authenticate, PaymentController.getAllPayments);

// Create
router.post("/create", authenticate, validateBody(CreatePaymentSchema), PaymentController.createPayment);

// Verify
router.post("/verify", validateBody(VerifyPaymentSchema), PaymentController.verifyPayment);

// Retry
router.post("/retry", validateBody(RetryPaymentSchema), PaymentController.retryPayment);

// Refund
router.post("/refund", authenticate, validateBody(RefundPaymentSchema), PaymentController.refundPayment);

// Cancel
router.post("/cancel", authenticate, validateBody(CancelPaymentSchema), PaymentController.cancelPayment);

// Get by specific order ID
router.get("/order/:orderId", authenticate, PaymentController.getPaymentByOrderId);

// Get by customer (using Auth token)
router.get("/customer", authenticate, PaymentController.getCustomerPayments);

// Get by ID
router.get("/:id", authenticate, PaymentController.getPaymentById);

export default router;
