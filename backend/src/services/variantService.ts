import { Food } from "../models/Food";
import { FoodVariant } from "../models/FoodVariant";
import { NotFoundError } from "../errors/NotFoundError";
import { BaseService } from "./BaseService";
import { QueryBuilder } from "../utils/QueryBuilder";

export class VariantService {

    static async createVariant(data: any) {
        const food = await Food.findById(data.food).select("-__v").lean();
        if (!food) {
            throw new NotFoundError("Food not found");
        }
        const variant = await FoodVariant.create(data);
        return variant;
    }

    static async getVariants(query: any) {
        const { page, limit, skip } = QueryBuilder.getPagination(query);

        const filter: any = {
            isDeleted: false
        };

        if (query.food) {
            filter.food = query.food;
        }

        const total = await FoodVariant.countDocuments(filter);

        const variants = await FoodVariant.find(filter)
            .populate("food", "name slug")
            .select("-__v")
            .lean()
            .skip(skip)
            .limit(limit)
            .sort({
                displayOrder: 1
            });

        return {
            variants,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getVariantById(id: string) {
        const variant = await FoodVariant.findOne({
            _id: id,
            isDeleted: false
        })
        .populate("food", "name slug")
        .select("-__v")
        .lean();

        if (!variant) {
            throw new NotFoundError("Variant not found");
        }

        return variant;
    }

    static async updateVariant(id: string, data: any) {
        const variant = await FoodVariant.findOne({
            _id: id,
            isDeleted: false
        });

        if (!variant) {
            throw new NotFoundError("Variant not found");
        }

        if (data.food) {
            const food = await Food.findById(data.food).select("-__v").lean();
            if (!food) {
                throw new NotFoundError("Food not found");
            }
        }

        Object.assign(variant, data);
        await variant.save();
        return variant;
    }

    static async deleteVariant(id: string) {
        const variant = await BaseService.softDelete(FoodVariant, id);
        if (!variant) {
            throw new NotFoundError("Variant not found");
        }
        return variant;
    }

    static async restoreVariant(id: string) {
        const variant = await BaseService.restore(FoodVariant, id);
        if (!variant) {
            throw new NotFoundError("Variant not found");
        }
        return variant;
    }

}

