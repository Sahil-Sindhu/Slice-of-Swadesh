import { Schema, model, Document } from "mongoose";

export interface ICartItem {
    variant: Schema.Types.ObjectId;
    food: Schema.Types.ObjectId;
    foodName: string;
    variantName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface ICart extends Document {
    customer: Schema.Types.ObjectId;
    items: ICartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    grandTotal: number;
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
    variant: {
        type: Schema.Types.ObjectId,
        ref: "FoodVariant",
        required: true
    },
    food: {
        type: Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    variantName: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
});

const CartSchema = new Schema<ICart>({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true
    },
    items: {
        type: [CartItemSchema],
        default: []
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    grandTotal: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

export const Cart = model<ICart>("Cart", CartSchema);
