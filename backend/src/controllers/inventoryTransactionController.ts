import { Request, Response } from "express";
import { InventoryTransactionService } from "../services/inventoryTransactionService";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";

export const addStock = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const result = await InventoryTransactionService.addStock({
            ...req.body,
            createdBy: userId
        });
        return sendSuccess(res, "Stock added successfully", result);
    } catch (error) {
        return handleError(res, error);
    }
};

export const removeStock = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const result = await InventoryTransactionService.removeStock({
            ...req.body,
            createdBy: userId
        });
        return sendSuccess(res, "Stock removed successfully", result);
    } catch (error) {
        return handleError(res, error);
    }
};

export const adjustStock = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const result = await InventoryTransactionService.adjustStock({
            ...req.body,
            createdBy: userId
        });
        return sendSuccess(res, "Stock adjusted successfully", result);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getInventoryHistory = async (req: Request, res: Response) => {
    try {
        const result = await InventoryTransactionService.getHistory(req.params.inventoryId, req.query);
        return sendSuccess(res, "Inventory history fetched successfully", result);
    } catch (error) {
        return handleError(res, error);
    }
};
