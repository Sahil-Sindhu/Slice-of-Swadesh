import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { CartService } from "../services/cartService";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const getCart = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) throw new UnauthorizedError("Not authenticated");
        const cart = await CartService.getCart(req.user._id.toString());
        return sendSuccess(res, "Cart retrieved successfully", { cart });
    } catch (error) {
        return handleError(res, error);
    }
};

export const addItem = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) throw new UnauthorizedError("Not authenticated");
        const { variant, quantity } = req.body;
        const cart = await CartService.addItem(req.user._id.toString(), variant, quantity);
        return sendSuccess(res, "Item added to cart successfully", { cart });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) throw new UnauthorizedError("Not authenticated");
        const { itemId } = req.params;
        const { quantity } = req.body;
        const cart = await CartService.updateItem(req.user._id.toString(), itemId, quantity);
        return sendSuccess(res, "Cart item updated successfully", { cart });
    } catch (error) {
        return handleError(res, error);
    }
};

export const removeItem = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) throw new UnauthorizedError("Not authenticated");
        const { itemId } = req.params;
        const cart = await CartService.removeItem(req.user._id.toString(), itemId);
        return sendSuccess(res, "Cart item removed successfully", { cart });
    } catch (error) {
        return handleError(res, error);
    }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) throw new UnauthorizedError("Not authenticated");
        const cart = await CartService.clearCart(req.user._id.toString());
        return sendSuccess(res, "Cart cleared successfully", { cart });
    } catch (error) {
        return handleError(res, error);
    }
};
