import { Request, Response } from "express";
import { VariantService } from "../services/variantService";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";
import { CacheService } from "../modules/cache/services/cache.service";
import { CACHE_KEYS } from "../modules/cache/constants/cache.constants";

export const createVariant = async (
    req: Request,
    res: Response
) => {
    try {
        const variant = await VariantService.createVariant(req.body);

        await CacheService.delete(CACHE_KEYS.MENU_FOODS);

        return sendSuccess(
            res,
            "Variant created successfully",
            {
                variant
            },
            201
        );
    }
    catch (error) {
        return handleError(res, error);
    }
};

export const getVariants = async (req: Request, res: Response) => {
    try {
        const result = await VariantService.getVariants(req.query);
        return sendSuccess(res, "Variants fetched successfully", result);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getVariantById = async (req: Request, res: Response) => {
    try {
        const variant = await VariantService.getVariantById(req.params.id);
        return sendSuccess(res, "Variant fetched successfully", { variant });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateVariant = async (req: Request, res: Response) => {
    try {
        const variant = await VariantService.updateVariant(req.params.id, req.body);
        
        await CacheService.delete(CACHE_KEYS.MENU_FOODS);
        
        return sendSuccess(res, "Variant updated successfully", { variant });
    } catch (error) {
        return handleError(res, error);
    }
};

export const deleteVariant = async (req: Request, res: Response) => {
    try {
        await VariantService.deleteVariant(req.params.id);

        await CacheService.delete(CACHE_KEYS.MENU_FOODS);

        return sendSuccess(res, "Variant moved to trash");
    } catch (error) {
        return handleError(res, error);
    }
};

export const restoreVariant = async (req: Request, res: Response) => {
    try {
        const variant = await VariantService.restoreVariant(req.params.id);
        
        await CacheService.delete(CACHE_KEYS.MENU_FOODS);
        
        return sendSuccess(res, "Variant restored successfully", { variant });
    } catch (error) {
        return handleError(res, error);
    }
};
