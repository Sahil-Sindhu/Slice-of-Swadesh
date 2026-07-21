import { Food } from "../models/Food";
import { Category } from "../models/Category";
import { generateUniqueSlug } from "../utils/generateSlug";
import { NotFoundError } from "../errors/NotFoundError";
import { QueryBuilder } from "../utils/QueryBuilder";
import { BaseService } from "./BaseService";

export class FoodService {

    static async createFood(data: any) {

        // Check category
        const category = await Category.findById(data.category);

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        // Validate subcategory if provided
        if (data.subCategory) {

            const subCategory = await Category.findById(data.subCategory);

            if (!subCategory) {
                throw new NotFoundError("Sub Category not found");
            }

        }

        // Generate slug
        const slug = await generateUniqueSlug(Food, data.name);

        const food = await Food.create({

            ...data,

            slug

        });

        return food;

    }

    static async getFoods(query: any) {

        const {
            page,
            limit,
            skip
        } = QueryBuilder.getPagination(query);

        const search = query.search || "";
        const category = query.category;
        const foodType = query.foodType;
        const isAvailable = query.isAvailable;

        const filter: any = {

            isDeleted: false

        };

        if (search) {

            filter.$or = [

                {

                    name: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {

                    description: {

                        $regex: search,

                        $options: "i"

                    }

                }

            ];

        }

        if (category) {

            filter.category = category;

        }

        if (foodType) {

            filter.foodType = foodType;

        }

        if (isAvailable !== undefined) {

            filter.isAvailable = isAvailable === "true";

        }

        const total = await Food.countDocuments(filter);

        const foods = await Food.find(filter)
            .select("-__v")
            .populate("category", "name slug")
            .populate("subCategory", "name slug")
            .populate({
                path: "variants",
                match: {
                    isDeleted: false,
                    isAvailable: true
                },
                options: {
                    sort: {
                        displayOrder: 1
                    }
                }
            })
            .sort({

                displayOrder: 1,

                createdAt: -1

            })

            .skip(skip)

            .limit(limit)
            .lean();

        return {

            foods,

            pagination: {

                total,

                page,

                limit,

                totalPages: Math.ceil(total / limit)

            }

        };

    }

    static async getFoodById(id: string) {

        const food = await Food.findOne({

            _id: id,

            isDeleted: false

        })
        .select("-__v")
        .populate("category", "name slug")
        .populate("subCategory", "name slug")
        .populate({
            path: "variants",
            match: {
                isDeleted: false,
                isAvailable: true
            },
            options: {
                sort: {
                    displayOrder: 1
                }
            }
        })
        .lean();

        if (!food) {

            throw new NotFoundError("Food not found");

        }

        return food;

    }

    static async getFoodBySlug(slug: string) {

        const food = await Food.findOne({

            slug,

            isDeleted: false

        })
        .select("-__v")
        .populate("category", "name slug")
        .populate("subCategory", "name slug")
        .populate({
            path: "variants",
            match: {
                isDeleted: false,
            },
            options: {
                sort: {
                    displayOrder: 1
                }
            }
        })
        .lean();

        if (!food) {

            throw new NotFoundError("Food not found");

        }

        return food;

    }

    static async updateFood(id: string, data: any) {

        const food = await Food.findOne({
            _id: id,
            isDeleted: false
        });

        if (!food) {
            throw new NotFoundError("Food not found");
        }

        // Category validation
        if (data.category) {

            const category = await Category.findById(data.category);

            if (!category) {
                throw new NotFoundError("Category not found");
            }

        }

        // Sub Category validation
        if (data.subCategory) {

            const subCategory = await Category.findById(data.subCategory);

            if (!subCategory) {
                throw new NotFoundError("Sub Category not found");
            }

        }

        // Regenerate slug if name changes
        if (data.name && data.name !== food.name) {

            data.slug = await generateUniqueSlug(Food, data.name);

        }

        Object.assign(food, data);

        await food.save();

        return food;

    }

    static async deleteFood(id: string) {

        const food = await BaseService.softDelete(

            Food,

            id

        );

        if (!food) {

            throw new NotFoundError("Food not found");

        }

        return food;

    }

    static async restoreFood(id: string) {

        const food = await BaseService.restore(

            Food,

            id

        );

        if (!food) {

            throw new NotFoundError("Food not found");

        }

        return food;

    }

}
