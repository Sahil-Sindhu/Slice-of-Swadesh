import { Schema, model, Document } from "mongoose";
import { INVENTORY_UNITS } from "../constants/inventory";

export interface IIngredient extends Document {
    name: string;
    description?: string;
    unit: string;
    minimumStock: number;
    isActive: boolean;
    isDeleted: boolean;
}

const IngredientSchema = new Schema<IIngredient>(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: String,
    unit: {
        type: String,
        enum: INVENTORY_UNITS,
        required: true
    },
    minimumStock: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

IngredientSchema.index({
    name: "text"
});

export const Ingredient = model<IIngredient>("Ingredient", IngredientSchema);
