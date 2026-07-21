import { Schema, model, Document } from "mongoose";
import { INVENTORY_TRANSACTION_TYPES } from "../constants/inventoryTransaction";

export interface IInventoryTransaction extends Document {
    inventory: Schema.Types.ObjectId;
    type: string;
    quantity: number;
    remarks?: string;
    createdBy?: Schema.Types.ObjectId;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
{
    inventory: {
        type: Schema.Types.ObjectId,
        ref: "Inventory",
        required: true
    },
    type: {
        type: String,
        enum: INVENTORY_TRANSACTION_TYPES,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    remarks: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
});

InventoryTransactionSchema.index({
    inventory: 1,
    createdAt: -1
});

export const InventoryTransaction = model<IInventoryTransaction>(
    "InventoryTransaction",
    InventoryTransactionSchema
);
