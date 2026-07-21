import { Inventory } from "../models/Inventory";
import { Ingredient } from "../models/Ingredient";
import { BaseService } from "./BaseService";
import { QueryBuilder } from "../utils/QueryBuilder";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";
import { NotificationService } from "../modules/notification/services/notification.service";
import { NotificationType, NotificationChannel } from "../modules/notification/constants/notification";
import { RealtimeService } from "../modules/realtime/services/realtime.service";
import { SocketEvent } from "../modules/realtime/constants/events";

export class InventoryService {

    private static validateStock(currentStock: number, reservedStock: number) {
        if (reservedStock > currentStock) {
            throw new ValidationError("Reserved stock cannot exceed current stock");
        }
    }

    static async createInventory(data: any) {
        // Rule 1: Ingredient must exist
        const ingredientObj = await Ingredient.findOne({
            _id: data.ingredient,
            isDeleted: false
        }).select("-__v").lean();

        if (!ingredientObj) {
            throw new NotFoundError("Ingredient not found");
        }

        // Rule 2: Only ONE inventory per ingredient
        const existingInventory = await Inventory.findOne({
            ingredient: data.ingredient,
            isDeleted: false
        }).select("-__v").lean();

        if (existingInventory) {
            throw new ValidationError("Inventory already exists for this ingredient");
        }

        // Rule 3: Reserved stock validation
        this.validateStock(data.currentStock, data.reservedStock || 0);

        const inventory = await Inventory.create(data);
        return inventory;
    }

    static async getInventories(query: any) {
        const { page, limit, skip } = QueryBuilder.getPagination(query);

        const filter: any = {
            isDeleted: false
        };

        if (query.ingredient) {
            filter.ingredient = query.ingredient;
        }

        // Professional text search on populated ingredient name
        if (query.search) {
            const matchedIngredients = await Ingredient.find({
                name: { $regex: query.search, $options: "i" },
                isDeleted: false
            }).select("_id").lean();

            const ingredientIds = matchedIngredients.map(i => i._id);
            filter.ingredient = { $in: ingredientIds };
        }

        const total = await Inventory.countDocuments(filter);

        const inventories = await Inventory.find(filter)
            .populate("ingredient", "name unit minimumStock")
            .select("-__v")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        // Calculate available stock explicitly to ensure lean queries return it
        const mappedInventories = inventories.map(item => ({
            ...item,
            availableStock: item.currentStock - item.reservedStock
        }));

        return {
            inventories: mappedInventories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getInventoryById(id: string) {
        const inventory = await Inventory.findOne({
            _id: id,
            isDeleted: false
        })
        .populate("ingredient", "name unit minimumStock")
        .select("-__v")
        .lean();

        if (!inventory) {
            throw new NotFoundError("Inventory not found");
        }

        return {
            ...inventory,
            availableStock: inventory.currentStock - inventory.reservedStock
        };
    }

    static async updateInventory(id: string, data: any) {
        const inventory = await Inventory.findOne({
            _id: id,
            isDeleted: false
        });

        if (!inventory) {
            throw new NotFoundError("Inventory not found");
        }

        const newCurrentStock = data.currentStock !== undefined ? data.currentStock : inventory.currentStock;
        const newReservedStock = data.reservedStock !== undefined ? data.reservedStock : inventory.reservedStock;

        this.validateStock(newCurrentStock, newReservedStock);

        if (data.ingredient && data.ingredient !== inventory.ingredient.toString()) {
            const ingredientObj = await Ingredient.findOne({
                _id: data.ingredient,
                isDeleted: false
            }).select("-__v").lean();

            if (!ingredientObj) {
                throw new NotFoundError("Ingredient not found");
            }

            const duplicate = await Inventory.findOne({
                ingredient: data.ingredient,
                isDeleted: false
            });

            if (duplicate && duplicate._id.toString() !== id) {
                throw new ValidationError("Inventory already exists for this ingredient");
            }
        }

        Object.assign(inventory, data);
        await inventory.save();

        // Check for Low Stock
        const ingredient = await Ingredient.findById(inventory.ingredient).select("name minimumStock").lean();
        if (ingredient && inventory.currentStock < ingredient.minimumStock) {
            NotificationService.send({
                type: NotificationType.LOW_STOCK,
                channels: [NotificationChannel.IN_APP], // System alert for admin
                title: "Low Stock Alert",
                message: `Inventory for ${ingredient.name} has fallen below the minimum stock level (${ingredient.minimumStock}). Current stock: ${inventory.currentStock}.`,
                metadata: { ingredientId: ingredient._id, currentStock: inventory.currentStock }
            }).catch(err => console.error("Notification failed", err));
            
            // Emit Realtime Event to Admin
            RealtimeService.emitToRoom('admin', SocketEvent.LOW_STOCK, {
                ingredientId: ingredient._id,
                name: ingredient.name,
                currentStock: inventory.currentStock,
                minimumStock: ingredient.minimumStock
            });
        }

        return inventory;
    }

    static async deleteInventory(id: string) {
        const inventory = await BaseService.softDelete(Inventory, id);
        if (!inventory) {
            throw new NotFoundError("Inventory not found");
        }
        return inventory;
    }

    static async restoreInventory(id: string) {
        const inventory = await BaseService.restore(Inventory, id);
        if (!inventory) {
            throw new NotFoundError("Inventory not found");
        }
        return inventory;
    }

}
