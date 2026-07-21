import { Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";

export const createInventory = async (req: Request, res: Response) => {
    try {
        const inventory = await InventoryService.createInventory(req.body);
        return sendSuccess(res, "Inventory created successfully", { inventory }, 201);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getInventories = async (req: Request, res: Response) => {
    try {
        const result = await InventoryService.getInventories(req.query);
        return sendSuccess(res, "Inventories fetched successfully", result);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getInventoryById = async (req: Request, res: Response) => {
    try {
        const inventory = await InventoryService.getInventoryById(req.params.id);
        return sendSuccess(res, "Inventory fetched successfully", { inventory });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateInventory = async (req: Request, res: Response) => {
    try {
        const inventory = await InventoryService.updateInventory(req.params.id, req.body);
        return sendSuccess(res, "Inventory updated successfully", { inventory });
    } catch (error) {
        return handleError(res, error);
    }
};

export const deleteInventory = async (req: Request, res: Response) => {
    try {
        await InventoryService.deleteInventory(req.params.id);
        return sendSuccess(res, "Inventory moved to trash");
    } catch (error) {
        return handleError(res, error);
    }
};

export const restoreInventory = async (req: Request, res: Response) => {
    try {
        const inventory = await InventoryService.restoreInventory(req.params.id);
        return sendSuccess(res, "Inventory restored successfully", { inventory });
    } catch (error) {
        return handleError(res, error);
    }
};
