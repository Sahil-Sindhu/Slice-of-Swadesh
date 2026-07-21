import { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { Order } from "../models/Order";
import { OrderTimeline } from "../models/OrderTimeline";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const customerId = req.body.customer || userId;

        const order = await OrderService.placeOrder({
            customer: customerId ? customerId.toString() : undefined,
            items: req.body.items,
            notes: req.body.notes,
            discount: req.body.discount,
            tax: req.body.tax,
            createdBy: userId ? userId.toString() : undefined
        });

        return sendSuccess(res, "Order placed successfully", {
            orderNumber: order.orderNumber,
            grandTotal: order.grandTotal,
            status: order.status
        }, 201);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getOrderHistory = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) throw new UnauthorizedError("Not authenticated");

        const orders = await Order.find({ customer: req.user._id, isDeleted: false })
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccess(res, "Order history retrieved successfully", { orders });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id, isDeleted: false })
            .select("-__v")
            .lean();

        if (!order) {
            throw new NotFoundError("Order not found");
        }

        return sendSuccess(res, "Order retrieved successfully", { order });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        const userId = req.user?._id;

        const order = await OrderService.updateStatus({
            orderId: id,
            status,
            remarks,
            updatedBy: userId ? userId.toString() : undefined
        });

        return sendSuccess(res, "Order status updated successfully", { order });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getKitchenQueue = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({
            status: { $in: ["Confirmed", "Preparing"] },
            isDeleted: false
        })
        .select("-__v")
        .sort({ createdAt: 1 })
        .lean();

        return sendSuccess(res, "Kitchen queue retrieved successfully", { orders });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const status = req.query.status as string;
        const paymentStatus = req.query.paymentStatus as string;

        const matchStage: any = { isDeleted: false };
        if (status) matchStage.status = status;
        if (paymentStatus) matchStage.paymentStatus = paymentStatus;

        const pipeline: any[] = [];

        // If searching, we lookup user to match by customer name or match orderNumber directly
        if (search) {
            const searchRegex = new RegExp(search, "i");
            pipeline.push({
                $lookup: {
                    from: "users",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customerDoc"
                }
            });
            pipeline.push({
                $unwind: { path: "$customerDoc", preserveNullAndEmptyArrays: true }
            });
            matchStage.$or = [
                { orderNumber: searchRegex },
                { "customerDoc.name": searchRegex },
                { "customerDoc.phone": searchRegex }
            ];
            pipeline.push({ $match: matchStage });
        } else {
            pipeline.push({ $match: matchStage });
            // Still lookup user so we can return customer details in the table
            pipeline.push({
                $lookup: {
                    from: "users",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customerDoc"
                }
            });
            pipeline.push({
                $unwind: { path: "$customerDoc", preserveNullAndEmptyArrays: true }
            });
        }

        // Add sorting
        pipeline.push({ $sort: { createdAt: -1 } });

        // Add pagination
        const skip = (page - 1) * limit;
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: limit }]
            }
        });

        const result = await Order.aggregate(pipeline);
        const data = result[0].data;
        const total = result[0].metadata[0]?.total || 0;

        return sendSuccess(res, "Orders retrieved successfully", {
            orders: data,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getOrderTimeline = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const timeline = await OrderTimeline.find({ order: id })
            .sort({ createdAt: 1 })
            .lean();

        return sendSuccess(res, "Order timeline retrieved successfully", { timeline });
    } catch (error) {
        return handleError(res, error);
    }
};
