import { Schema, model, Document } from "mongoose";
import { ORDER_STATUS } from "../constants/order";

export interface IOrderTimeline extends Document {
    order: Schema.Types.ObjectId;
    oldStatus?: string | null;
    newStatus: string;
    remarks?: string;
    updatedBy?: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const OrderTimelineSchema = new Schema<IOrderTimeline>(
{
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true
    },
    oldStatus: {
        type: String,
        enum: [...ORDER_STATUS, null],
        default: null
    },
    newStatus: {
        type: String,
        enum: ORDER_STATUS,
        required: true
    },
    remarks: {
        type: String
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
});

export const OrderTimeline = model<IOrderTimeline>("OrderTimeline", OrderTimelineSchema);
