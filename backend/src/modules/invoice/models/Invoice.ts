import mongoose, { Document, Schema } from 'mongoose';

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  GENERATED = "GENERATED",
  SENT = "SENT"
}

export interface IInvoice {
  invoiceNumber: string;
  orderId: string;
  customerId?: mongoose.Types.ObjectId;
  paymentId?: string;
  status: InvoiceStatus;
  templateVersion: string;
  pdfUrl?: string;
  generatedAt?: Date;
}

export interface IInvoiceDocument extends IInvoice, Document {
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoiceDocument>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    paymentId: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.DRAFT,
    },
    templateVersion: {
      type: String,
      required: true,
      default: "v1",
    },
    pdfUrl: {
      type: String,
      required: false,
    },
    generatedAt: {
      type: Date,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
invoiceSchema.index({ orderId: 1 });
invoiceSchema.index({ customerId: 1 });

export const Invoice = mongoose.model<IInvoiceDocument>('Invoice', invoiceSchema);
