import { Schema, model, Document } from "mongoose";

export interface IFoodVariant extends Document {
    food: Schema.Types.ObjectId;
    name: string;
    price: number;
    preparationTime: number;
    isAvailable: boolean;
    displayOrder: number;
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
    isDeleted: boolean;
}

const FoodVariantSchema = new Schema<IFoodVariant>(
{
    food: {
        type: Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    preparationTime: {
        type: Number,
        default: 15
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

FoodVariantSchema.index({
    food: 1,
    name: 1
},
{
    unique: true
});

export const FoodVariant = model<IFoodVariant>(
    "FoodVariant",
    FoodVariantSchema
);
