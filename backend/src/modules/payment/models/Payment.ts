import { Schema, model, Document } from "mongoose";
import { PaymentStatus, PaymentGatewayEnum } from "../constants/payment";
import { IPayment } from "../types/payment";

export interface IPaymentDocument extends IPayment, Document {
  _id: any;
}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    gateway: {
      type: String,
      enum: Object.values(PaymentGatewayEnum),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
    },
    transactionId: {
      type: String,
    },
    receipt: {
      type: String,
    },
    notes: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

export const Payment = model<IPaymentDocument>("Payment", PaymentSchema);
