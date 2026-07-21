import { Invoice, InvoiceStatus } from "../models/Invoice";
import { HtmlPdfGenerator } from "../providers/HtmlPdfGenerator";
import { Order } from "../../../models/Order";
import { User } from "../../../models/User";
import { NotFoundError } from "../../../errors/NotFoundError";

export class InvoiceService {
  private static generator = new HtmlPdfGenerator();

  static async generateInvoiceForOrder(orderId: string): Promise<Buffer> {
    // 1. Fetch Order
    const order = await Order.findOne({ orderNumber: orderId }).lean();
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // 2. Find or Create Invoice Record
    let invoice = await Invoice.findOne({ orderId });
    if (!invoice) {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      invoice = await Invoice.create({
        invoiceNumber,
        orderId,
        customerId: order.customer,
        status: InvoiceStatus.GENERATED,
        templateVersion: "v1",
        generatedAt: new Date()
      });
    }

    // 3. Fetch Customer Details
    let customerName = "Guest";
    let customerEmail = "N/A";
    if (order.customer) {
      const user = await User.findById(order.customer).select("name email").lean();
      if (user) {
        customerName = user.name;
        customerEmail = user.email;
      }
    }

    // 4. Build Context
    const context = {
      invoiceNumber: invoice.invoiceNumber,
      date: new Date().toLocaleDateString(),
      customerName,
      customerEmail,
      orderId: order.orderNumber,
      items: order.items.map((item: any) => ({
        name: item.foodName,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      deliveryFee: (order as any).deliveryFee || 0,
      grandTotal: order.grandTotal,
      templateVersion: invoice.templateVersion
    };

    // 5. Generate PDF Buffer
    const pdfBuffer = await this.generator.generate(context);

    // If you were uploading to S3, you'd do it here and update invoice.pdfUrl
    
    return pdfBuffer;
  }
}
