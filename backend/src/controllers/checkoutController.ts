import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { CheckoutService } from "../services/checkoutService";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const checkout = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) throw new UnauthorizedError("Not authenticated");
        
        const { order, paymentIntent } = await CheckoutService.checkout(req.user._id.toString());
        
        return sendSuccess(res, "Checkout completed successfully", {
            orderNumber: order.orderNumber,
            grandTotal: order.grandTotal,
            paymentStatus: order.paymentStatus,
            status: order.status,
            paymentIntent // Frontend uses this to initiate gateway
        }, 201);
    } catch (error) {
        return handleError(res, error);
    }
};
