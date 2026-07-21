import { Request, Response } from "express";
// getFoodBySlug used by /api/v1/foods/slug/:slug
import { FoodService } from "../services/foodService";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";
import { CacheService } from "../modules/cache/services/cache.service";
import { CACHE_KEYS, CACHE_TTL } from "../modules/cache/constants/cache.constants";

export const createFood = async (
    req: Request,
    res: Response
) => {

    try {

        const food = await FoodService.createFood(req.body);

        await CacheService.delete(CACHE_KEYS.MENU_FOODS);

        return sendSuccess(
            res,
            "Food created successfully",
            { food },
            201
        );

    } catch (error) {

        return handleError(res, error);

    }

};

export const getFoods = async (

    req: Request,

    res: Response

) => {

    try {

        const { search, category, foodType } = req.query;
        // Only cache if it's the customer-facing getFoods (no search, no category, etc, or just isAvailable)
        let result;
        if (!search && !category && !foodType && req.query.isAvailable === 'true' && !req.query.page) {
            result = await CacheService.getOrSet(
                CACHE_KEYS.MENU_FOODS,
                () => FoodService.getFoods(req.query),
                CACHE_TTL.MENU_FOODS
            );
        } else {
            result = await FoodService.getFoods(req.query);
        }

        return sendSuccess(

            res,

            "Foods fetched successfully",

            result

        );

    }

    catch (error) {

        return handleError(res, error);

    }

};

export const getFoodById = async (

    req: Request,

    res: Response

) => {

    try {

        const food = await FoodService.getFoodById(

            req.params.id

        );

        return sendSuccess(

            res,

            "Food fetched successfully",

            { food }

        );

    }

    catch (error) {

        return handleError(res, error);

    }

};

export const getFoodBySlug = async (
    req: Request,
    res: Response
) => {
    try {
        const food = await FoodService.getFoodBySlug(req.params.slug);
        return sendSuccess(res, "Food fetched successfully", { food });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateFood = async (
    req: Request,
    res: Response
) => {

    try {

        const food = await FoodService.updateFood(
            req.params.id,
            req.body
        );

        await CacheService.delete(CACHE_KEYS.MENU_FOODS);

        return sendSuccess(
            res,
            "Food updated successfully",
            { food }
        );

    } catch (error) {

        return handleError(res, error);

    }

};

export const deleteFood = async (
    req: Request,
    res: Response
) => {

    try {

        await FoodService.deleteFood(req.params.id);
        
        await CacheService.delete(CACHE_KEYS.MENU_FOODS);

        return sendSuccess(
            res,
            "Food moved to trash"
        );

    } catch (error) {

        return handleError(res, error);

    }

};

export const restoreFood = async (
    req: Request,
    res: Response
) => {

    try {

        const food = await FoodService.restoreFood(
            req.params.id
        );

        await CacheService.delete(CACHE_KEYS.MENU_FOODS);

        return sendSuccess(
            res,
            "Food restored successfully",
            { food }
        );

    } catch (error) {

        return handleError(res, error);

    }

};
