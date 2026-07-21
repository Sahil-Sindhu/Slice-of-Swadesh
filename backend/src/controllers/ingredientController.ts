import { Request, Response } from "express";
import { IngredientService } from "../services/ingredientService";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";

export const createIngredient = async (req: Request, res: Response) => {
    try {
        const ingredient = await IngredientService.createIngredient(req.body);
        return sendSuccess(res, "Ingredient created successfully", { ingredient }, 201);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getIngredients = async (req: Request, res: Response) => {
    try {
        const result = await IngredientService.getIngredients(req.query);
        return sendSuccess(res, "Ingredients fetched successfully", result);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getIngredientById = async (req: Request, res: Response) => {
    try {
        const ingredient = await IngredientService.getIngredientById(req.params.id);
        return sendSuccess(res, "Ingredient fetched successfully", { ingredient });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateIngredient = async (req: Request, res: Response) => {
    try {
        const ingredient = await IngredientService.updateIngredient(req.params.id, req.body);
        return sendSuccess(res, "Ingredient updated successfully", { ingredient });
    } catch (error) {
        return handleError(res, error);
    }
};

export const deleteIngredient = async (req: Request, res: Response) => {
    try {
        await IngredientService.deleteIngredient(req.params.id);
        return sendSuccess(res, "Ingredient moved to trash");
    } catch (error) {
        return handleError(res, error);
    }
};

export const restoreIngredient = async (req: Request, res: Response) => {
    try {
        const ingredient = await IngredientService.restoreIngredient(req.params.id);
        return sendSuccess(res, "Ingredient restored successfully", { ingredient });
    } catch (error) {
        return handleError(res, error);
    }
};
