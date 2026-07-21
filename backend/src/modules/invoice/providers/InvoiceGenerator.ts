export interface InvoiceGeneratorContext {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number; // GST
  deliveryFee: number;
  grandTotal: number;
  templateVersion: string;
}

export interface InvoiceGenerator {
  generate(context: InvoiceGeneratorContext): Promise<Buffer>;
}
