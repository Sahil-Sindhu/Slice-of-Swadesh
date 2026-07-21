import { Request, Response } from "express";
import { Category } from "../models/Category";
import { sendSuccess } from "../utils/response";
import { generateUniqueSlug } from "../utils/generateSlug";
import { handleError } from "../utils/errorHandler";
import { isCircularReference } from "../utils/category";
import { QueryBuilder } from "../utils/QueryBuilder";
import { BaseService } from "../services/BaseService";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";
import { CacheService } from "../modules/cache/services/cache.service";
import { CACHE_KEYS, CACHE_TTL } from "../modules/cache/constants/cache.constants";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image, displayOrder, isActive, parentCategory } = req.body;

    const slug = await generateUniqueSlug(Category, name);

    let level = 0;

    if (parentCategory) {

        const parent = await Category.findById(parentCategory);

        if (parent) {

            level = parent.level + 1;

        }

    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      displayOrder,
      isActive,
      level,
      parentCategory: parentCategory || null,
    });

    await CacheService.delete(CACHE_KEYS.MENU_CATEGORIES);

    return sendSuccess(res, "Category created successfully", { category }, 201);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = QueryBuilder.getPagination(req.query);
    const search = (req.query.search as string) || "";

    const query: any = {
      isDeleted: false,
    };

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    const fetchCategories = async () => {
      const total = await Category.countDocuments(query);
      const categories = await Category.find(query)
        .select("-__v")
        .populate("parentCategory", "name slug")
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return {
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        categories,
      };
    };

    let result;
    // Only cache if it's a generic unpaginated/unfiltered fetch or just first page
    if (!search && page === 1 && limit === 10) {
      result = await CacheService.getOrSet(
        CACHE_KEYS.MENU_CATEGORIES,
        fetchCategories,
        CACHE_TTL.MENU_CATEGORIES
      );
    } else {
      result = await fetchCategories();
    }

    return sendSuccess(res, "Categories fetched successfully", result);
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const {
      name,
      description,
      image,
      displayOrder,
      isActive,
      parentCategory
    } = req.body;

    if (name && name !== category.name) {

        category.name = name;

        category.slug = await generateUniqueSlug(Category, name);

    }

    if (description !== undefined) {
      category.description = description;
    }

    if (image !== undefined) {
      category.image = image;
    }

    if (displayOrder !== undefined) {
      category.displayOrder = displayOrder;
    }

    if (
        parentCategory &&
        parentCategory === category._id.toString()
    ) {

        throw new ValidationError("A category cannot be its own parent.");

    }

    if (
        parentCategory &&
        await isCircularReference(
            category._id.toString(),
            parentCategory
        )
    ) {

        throw new ValidationError("Circular category hierarchy detected.");

    }

    if (parentCategory !== undefined) {

        category.parentCategory = parentCategory || null;

        if (parentCategory) {

            const parent = await Category.findById(parentCategory);

            category.level = parent ? parent.level + 1 : 0;

        } else {

            category.level = 0;

        }

    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();
    
    await CacheService.delete(CACHE_KEYS.MENU_CATEGORIES);

    return sendSuccess(res, "Category updated successfully", { category });

  } catch (error) {
    return handleError(res, error);
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id)
      .select("-__v")
      .lean();

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return sendSuccess(res, "Category fetched successfully", { category });
  } catch (error) {
    return handleError(res, error);
  }
};



export const deleteCategory = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const category = await BaseService.softDelete(Category, id);

        if (!category) {

            throw new NotFoundError("Category not found");

        }
        
        await CacheService.delete(CACHE_KEYS.MENU_CATEGORIES);

        return sendSuccess(res, "Category moved to trash");

    }

    catch (error) {
        return handleError(res, error);
    }

};

export const restoreCategory = async (req: Request, res: Response) => {

    try {

        const category = await BaseService.restore(Category, req.params.id);

        if (!category) {

            throw new NotFoundError("Category not found");

        }
        
        await CacheService.delete(CACHE_KEYS.MENU_CATEGORIES);

        return sendSuccess(res, "Category restored successfully", { category });

    }

    catch (error) {
        return handleError(res, error);
    }

};

export const getCategoryTree = async (req: Request, res: Response) => {

    try {

        const categories = await Category.find({
            isDeleted: false
        })
        .select("-__v")
        .lean();

        const categoryMap = new Map();

        categories.forEach(category => {

            categoryMap.set(
                category._id.toString(),
                {
                    ...category,
                    children: []
                }
            );

        });

        const tree: any[] = [];

        categories.forEach(category => {

            if (category.parentCategory) {

                const parent = categoryMap.get(
                    category.parentCategory.toString()
                );

                if (parent) {

                    parent.children.push(
                        categoryMap.get(category._id.toString())
                    );

                }

            } else {

                tree.push(
                    categoryMap.get(category._id.toString())
                );

            }

        });

        return sendSuccess(

            res,

            "Category tree fetched successfully",

            {
                categories: tree
            }

        );

    }

    catch (error) {

        return handleError(res, error);

    }

};

export const getCategoryAnalytics = async (
    req: Request,
    res: Response
) => {

    try {

        const totalCategories =
            await Category.countDocuments();

        const activeCategories =
            await Category.countDocuments({
                isActive: true,
                isDeleted: false
            });

        const inactiveCategories =
            await Category.countDocuments({
                isActive: false,
                isDeleted: false
            });

        const deletedCategories =
            await Category.countDocuments({
                isDeleted: true
            });

        const rootCategories =
            await Category.countDocuments({
                parentCategory: null,
                isDeleted: false
            });

        const subCategories =
            await Category.countDocuments({
                parentCategory: { $ne: null },
                isDeleted: false
            });

        return sendSuccess(

            res,

            "Category analytics fetched successfully",

            {

                totalCategories,

                activeCategories,

                inactiveCategories,

                deletedCategories,

                rootCategories,

                subCategories

            }

        );

    }

    catch (error) {

        return handleError(res, error);

    }

};

