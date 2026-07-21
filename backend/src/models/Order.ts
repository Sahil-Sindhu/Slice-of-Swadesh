import { Schema, model, Document } from "mongoose";
import { ORDER_STATUS, PAYMENT_STATUS } from "../constants/order";

export interface IOrderItem {
    food: Schema.Types.ObjectId;
    variant: Schema.Types.ObjectId;
    foodName: string;
    variantName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface IOrder extends Document {
    orderNumber: string;
    customer?: Schema.Types.ObjectId;
    items: IOrderItem[];
    subtotal: number;
    tax: number;
    discount: number;
    grandTotal: number;
    status: string;
    paymentStatus: string;
    notes?: string;
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
    isDeleted: boolean;
    timers: {
        placedAt: Date;
        startedPreparingAt?: Date;
        readyAt?: Date;
        deliveredAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    food: {
        type: Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    variant: {
        type: Schema.Types.ObjectId,
        ref: "FoodVariant",
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
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: [
            (val: IOrderItem[]) => val.length > 0,
            "An order must have at least one item."
        ]
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
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
    grandTotal: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ORDER_STATUS,
        default: "Pending"
    },
    paymentStatus: {
        type: String,
        enum: PAYMENT_STATUS,
        default: "Pending"
    },
    notes: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    timers: {
        placedAt: { type: Date, default: Date.now },
        startedPreparingAt: { type: Date },
        readyAt: { type: Date },
        deliveredAt: { type: Date }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Heavy query indexes for dashboard search
OrderSchema.index({ customer: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = model<IOrder>("Order", OrderSchema);
