import { Recipe } from "../models/Recipe";
import { FoodVariant } from "../models/FoodVariant";
import { Ingredient } from "../models/Ingredient";
import { BaseService } from "./BaseService";
import { QueryBuilder } from "../utils/QueryBuilder";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";

export class RecipeService {

    static async createRecipe(data: any) {
        // Rule 1: Food Variant must exist
        const variantObj = await FoodVariant.findOne({
            _id: data.foodVariant,
            isDeleted: false
        }).select("-__v").lean();

        if (!variantObj) {
            throw new NotFoundError("Food variant not found");
        }

        // Rule 2: Ingredient must exist
        const ingredientObj = await Ingredient.findOne({
            _id: data.ingredient,
            isDeleted: false
        }).select("-__v").lean();

        if (!ingredientObj) {
            throw new NotFoundError("Ingredient not found");
        }

        // Rule 4: Duplicate recipe mapping check
        const existingRecipe = await Recipe.findOne({
            foodVariant: data.foodVariant,
            ingredient: data.ingredient,
            isDeleted: false
        }).select("-__v").lean();

        if (existingRecipe) {
            throw new ValidationError("Recipe mapping already exists for this variant and ingredient");
        }

        const recipe = await Recipe.create(data);
        return recipe;
    }

    static async getRecipes(query: any) {
        const { page, limit, skip } = QueryBuilder.getPagination(query);

        const filter: any = {
            isDeleted: false
        };

        // Support filtering by both parameter options
        if (query.variant) {
            filter.foodVariant = query.variant;
        }
        if (query.foodVariant) {
            filter.foodVariant = query.foodVariant;
        }

        if (query.ingredient) {
            filter.ingredient = query.ingredient;
        }

        // Search text on ingredient name
        if (query.search) {
            const matchedIngredients = await Ingredient.find({
                name: { $regex: query.search, $options: "i" },
                isDeleted: false
            }).select("_id").lean();

            const ingredientIds = matchedIngredients.map(i => i._id);
            filter.ingredient = { $in: ingredientIds };
        }

        const total = await Recipe.countDocuments(filter);

        const recipes = await Recipe.find(filter)
            .populate({
                path: "foodVariant",
                select: "name price food",
                populate: {
                    path: "food",
                    select: "name slug"
                }
            })
            .populate("ingredient", "name unit minimumStock")
            .select("-__v")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        return {
            recipes,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getRecipeById(id: string) {
        const recipe = await Recipe.findOne({
            _id: id,
            isDeleted: false
        })
        .populate({
            path: "foodVariant",
            select: "name price food",
            populate: {
                path: "food",
                select: "name slug"
            }
        })
        .populate("ingredient", "name unit minimumStock")
        .select("-__v")
        .lean();

        if (!recipe) {
            throw new NotFoundError("Recipe not found");
        }

        return recipe;
    }

    static async updateRecipe(id: string, data: any) {
        const recipe = await Recipe.findOne({
            _id: id,
            isDeleted: false
        });

        if (!recipe) {
            throw new NotFoundError("Recipe not found");
        }

        const targetVariant = data.foodVariant !== undefined ? data.foodVariant : recipe.foodVariant.toString();
        const targetIngredient = data.ingredient !== undefined ? data.ingredient : recipe.ingredient.toString();

        if (data.foodVariant && data.foodVariant !== recipe.foodVariant.toString()) {
            const variantObj = await FoodVariant.findOne({
                _id: data.foodVariant,
                isDeleted: false
            }).select("-__v").lean();

            if (!variantObj) {
                throw new NotFoundError("Food variant not found");
            }
        }

        if (data.ingredient && data.ingredient !== recipe.ingredient.toString()) {
            const ingredientObj = await Ingredient.findOne({
                _id: data.ingredient,
                isDeleted: false
            }).select("-__v").lean();

            if (!ingredientObj) {
                throw new NotFoundError("Ingredient not found");
            }
        }

        // Duplication check on change
        if (
            (data.foodVariant && data.foodVariant !== recipe.foodVariant.toString()) ||
            (data.ingredient && data.ingredient !== recipe.ingredient.toString())
        ) {
            const duplicate = await Recipe.findOne({
                foodVariant: targetVariant,
                ingredient: targetIngredient,
                isDeleted: false
            });

            if (duplicate && duplicate._id.toString() !== id) {
                throw new ValidationError("Recipe mapping already exists for this variant and ingredient");
            }
        }

        Object.assign(recipe, data);
        await recipe.save();
        return recipe;
    }

    static async deleteRecipe(id: string) {
        const recipe = await BaseService.softDelete(Recipe, id);
        if (!recipe) {
            throw new NotFoundError("Recipe not found");
        }
        return recipe;
    }

    static async restoreRecipe(id: string) {
        const recipe = await BaseService.restore(Recipe, id);
        if (!recipe) {
            throw new NotFoundError("Recipe not found");
        }
        return recipe;
    }

}
