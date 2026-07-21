import { Request, Response } from "express";
import { RecipeService } from "../services/recipeService";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";

export const createRecipe = async (req: Request, res: Response) => {
    try {
        const recipe = await RecipeService.createRecipe(req.body);
        return sendSuccess(res, "Recipe created successfully", { recipe }, 201);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getRecipes = async (req: Request, res: Response) => {
    try {
        const result = await RecipeService.getRecipes(req.query);
        return sendSuccess(res, "Recipes fetched successfully", result);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getRecipeById = async (req: Request, res: Response) => {
    try {
        const recipe = await RecipeService.getRecipeById(req.params.id);
        return sendSuccess(res, "Recipe fetched successfully", { recipe });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateRecipe = async (req: Request, res: Response) => {
    try {
        const recipe = await RecipeService.updateRecipe(req.params.id, req.body);
        return sendSuccess(res, "Recipe updated successfully", { recipe });
    } catch (error) {
        return handleError(res, error);
    }
};

export const deleteRecipe = async (req: Request, res: Response) => {
    try {
        await RecipeService.deleteRecipe(req.params.id);
        return sendSuccess(res, "Recipe moved to trash");
    } catch (error) {
        return handleError(res, error);
    }
};

export const restoreRecipe = async (req: Request, res: Response) => {
    try {
        const recipe = await RecipeService.restoreRecipe(req.params.id);
        return sendSuccess(res, "Recipe restored successfully", { recipe });
    } catch (error) {
        return handleError(res, error);
    }
};
