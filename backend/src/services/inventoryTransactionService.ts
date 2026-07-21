import { Inventory } from "../models/Inventory";
import { InventoryTransaction } from "../models/InventoryTransaction";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";
import { QueryBuilder } from "../utils/QueryBuilder";

export class InventoryTransactionService {

    static async addStock(data: any) {
        const inventory = await Inventory.findOne({
            _id: data.inventory,
            isDeleted: false
        });

        if (!inventory) {
            throw new NotFoundError("Inventory not found");
        }

        const transaction = await InventoryTransaction.create({
            inventory: data.inventory,
            type: "ADD",
            quantity: data.quantity,
            remarks: data.remarks || "Stock added",
            createdBy: data.createdBy
        });

        inventory.currentStock += data.quantity;
        await inventory.save();

        return { inventory, transaction };
    }

    static async removeStock(data: any) {
        const inventory = await Inventory.findOne({
            _id: data.inventory,
            isDeleted: false
        });

        if (!inventory) {
            throw new NotFoundError("Inventory not found");
        }

        if (inventory.currentStock < data.quantity) {
            throw new ValidationError("Insufficient stock");
        }

        if (inventory.currentStock - data.quantity < inventory.reservedStock) {
            throw new ValidationError("Deduction would cause current stock to go below reserved stock");
        }

        const transaction = await InventoryTransaction.create({
            inventory: data.inventory,
            type: data.type || "REMOVE",
            quantity: data.quantity,
            remarks: data.remarks || "Stock removed",
            createdBy: data.createdBy
        });

        inventory.currentStock -= data.quantity;
        await inventory.save();

        return { inventory, transaction };
    }

    static async adjustStock(data: any) {
        const inventory = await Inventory.findOne({
            _id: data.inventory,
            isDeleted: false
        });

        if (!inventory) {
            throw new NotFoundError("Inventory not found");
        }

        if (data.quantity < inventory.reservedStock) {
            throw new ValidationError("Adjusted stock count cannot be less than reserved stock");
        }

        const transaction = await InventoryTransaction.create({
            inventory: data.inventory,
            type: "ADJUST",
            quantity: data.quantity,
            remarks: data.remarks || "Stock adjusted",
            createdBy: data.createdBy
        });

        inventory.currentStock = data.quantity;
        await inventory.save();

        return { inventory, transaction };
    }

    static async getHistory(inventoryId: string, query: any) {
        const inventoryExists = await Inventory.exists({
            _id: inventoryId,
            isDeleted: false
        });

        if (!inventoryExists) {
            throw new NotFoundError("Inventory not found");
        }

        const { page, limit, skip } = QueryBuilder.getPagination(query);

        const filter = {
            inventory: inventoryId
        };

        const total = await InventoryTransaction.countDocuments(filter);

        const transactions = await InventoryTransaction.find(filter)
            .populate({
                path: "inventory",
                populate: {
                    path: "ingredient",
                    select: "name unit minimumStock"
                }
            })
            .populate("createdBy", "name email")
            .select("-__v")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        return {
            transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

}
