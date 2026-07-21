import { FoodVariant } from "../models/FoodVariant";
import { Recipe } from "../models/Recipe";
import { Inventory } from "../models/Inventory";
import { InventoryTransaction } from "../models/InventoryTransaction";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";

export class StockDeductionService {

    private static async validateStock(inventoryItems: Array<{ item: any, inventory: any }>, orderQuantity: number) {
        for (const { item, inventory } of inventoryItems) {
            const required = item.quantity * orderQuantity;
            const available = inventory.currentStock - inventory.reservedStock;

            if (available < required) {
                throw new ValidationError(`Insufficient stock`);
            }
        }
    }

    private static async deductIngredient(inventory: any, requiredQuantity: number, orderReference?: string, userId?: string, session?: any) {
        inventory.currentStock -= requiredQuantity;
        await inventory.save({ session });

        await InventoryTransaction.create([{
            inventory: inventory._id,
            type: "ORDER",
            quantity: requiredQuantity,
            remarks: orderReference || "Order deduction",
            createdBy: userId
        }], { session });
    }

    static async deductStockForVariant(variantId: string, orderQuantity: number, orderReference?: string, userId?: string, session?: any) {
        // Rule 1: Variant must exist
        const variant = await FoodVariant.findOne({
            _id: variantId,
            isDeleted: false
        }).session(session).select("-__v").lean();

        if (!variant) {
            throw new NotFoundError("Food variant not found");
        }

        // Rule 2: Recipe must exist
        const recipeItems = await Recipe.find({
            foodVariant: variantId,
            isDeleted: false
        }).populate("ingredient").session(session).lean();

        if (!recipeItems || recipeItems.length === 0) {
            throw new NotFoundError("Recipe not found for this variant");
        }

        // Rule 3: Inventory must exist for each ingredient
        const inventoryItems = [];
        for (const item of recipeItems) {
            const inventory = await Inventory.findOne({
                ingredient: (item.ingredient as any)._id,
                isDeleted: false
            }).session(session);

            if (!inventory) {
                throw new NotFoundError("Inventory not found");
            }

            inventoryItems.push({
                item,
                inventory
            });
        }

        // Rule 5: Validate ALL before deducting any (All-or-Nothing)
        await this.validateStock(inventoryItems, orderQuantity);

        // Deduct ALL
        for (const { item, inventory } of inventoryItems) {
            const required = item.quantity * orderQuantity;
            await this.deductIngredient(inventory, required, orderReference, userId, session);
        }

        return {
            success: true,
            message: "Stock deducted successfully"
        };
    }

}
