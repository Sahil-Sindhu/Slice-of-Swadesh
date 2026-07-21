import { Schema, model, Document } from "mongoose";

export interface IRecipe extends Document {
    foodVariant: Schema.Types.ObjectId;
    ingredient: Schema.Types.ObjectId;
    quantity: number;
    isDeleted: boolean;
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
}

const RecipeSchema = new Schema<IRecipe>(
{
    foodVariant: {
        type: Schema.Types.ObjectId,
        ref: "FoodVariant",
        required: true
    },
    ingredient: {
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0.001
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

// Index to prevent duplicate foodVariant + ingredient mappings for active recipes
RecipeSchema.index({
    foodVariant: 1,
    ingredient: 1,
    isDeleted: 1
}, {
    unique: true
});

export const Recipe = model<IRecipe>("Recipe", RecipeSchema);
