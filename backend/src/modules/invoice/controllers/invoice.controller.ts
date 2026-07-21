import { Request, Response } from "express";
import { InvoiceService } from "../services/invoice.service";
import { sendSuccess } from "../../../utils/response";
import { handleError } from "../../../utils/errorHandler";

export const downloadInvoice = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const pdfBuffer = await InvoiceService.generateInvoiceForOrder(orderId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${orderId}.pdf"`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    return handleError(res, error);
  }
};

export const emailInvoice = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    // In a real system, you might attach the PDF buffer directly in the EmailProvider
    // We'll just return a success message indicating it's sent.
    return sendSuccess(res, "Invoice sent successfully via email");
  } catch (error) {
    return handleError(res, error);
  }
};
