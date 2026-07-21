import { Category } from "../models/Category";

export const isCircularReference = async (
    categoryId: string,
    parentId: string
): Promise<boolean> => {

    let currentParent = await Category.findById(parentId).select("-__v").lean();

    while (currentParent) {

        if (currentParent._id.toString() === categoryId) {
            return true;
        }

        if (!currentParent.parentCategory) {
            return false;
        }

        currentParent = await Category.findById(
            currentParent.parentCategory
        ).select("-__v").lean();
    }

    return false;
};
