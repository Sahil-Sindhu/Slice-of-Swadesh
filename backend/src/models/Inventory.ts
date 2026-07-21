import { Schema, model, Document } from "mongoose";

export interface IInventory extends Document {
    ingredient: Schema.Types.ObjectId;
    currentStock: number;
    reservedStock: number;
    isDeleted: boolean;
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
}

const InventorySchema = new Schema<IInventory>(
{
    ingredient: {
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
        unique: true
    },
    currentStock: {
        type: Number,
        default: 0,
        min: 0
    },
    reservedStock: {
        type: Number,
        default: 0,
        min: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
});

InventorySchema.virtual("availableStock").get(function() {
    return this.currentStock - this.reservedStock;
});

InventorySchema.set("toJSON", { virtuals: true });
InventorySchema.set("toObject", { virtuals: true });

export const Inventory = model<IInventory>("Inventory", InventorySchema);
