import { Ingredient } from "../models/Ingredient";
import { BaseService } from "./BaseService";
import { QueryBuilder } from "../utils/QueryBuilder";
import { NotFoundError } from "../errors/NotFoundError";

export class IngredientService {

    static async createIngredient(data: any) {
        return await Ingredient.create(data);
    }

    static async getIngredients(query: any) {
        const { page, limit, skip } = QueryBuilder.getPagination(query);

        const filter: any = {
            isDeleted: false
        };

        if (query.search) {
            filter.$text = { $search: query.search };
        }

        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === "true";
        }

        const total = await Ingredient.countDocuments(filter);

        const ingredients = await Ingredient.find(filter)
            .select("-__v")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        return {
            ingredients,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getIngredientById(id: string) {
        const ingredient = await Ingredient.findOne({
            _id: id,
            isDeleted: false
        })
        .select("-__v")
        .lean();

        if (!ingredient) {
            throw new NotFoundError("Ingredient not found");
        }

        return ingredient;
    }

    static async updateIngredient(id: string, data: any) {
        const ingredient = await Ingredient.findOne({
            _id: id,
            isDeleted: false
        });

        if (!ingredient) {
            throw new NotFoundError("Ingredient not found");
        }

        Object.assign(ingredient, data);
        await ingredient.save();
        return ingredient;
    }

    static async deleteIngredient(id: string) {
        const ingredient = await BaseService.softDelete(Ingredient, id);
        if (!ingredient) {
            throw new NotFoundError("Ingredient not found");
        }
        return ingredient;
    }

    static async restoreIngredient(id: string) {
        const ingredient = await BaseService.restore(Ingredient, id);
        if (!ingredient) {
            throw new NotFoundError("Ingredient not found");
        }
        return ingredient;
    }

}
