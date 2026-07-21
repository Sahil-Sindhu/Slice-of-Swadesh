import mongoose from "mongoose";
import { Order } from "../models/Order";
import { OrderTimeline } from "../models/OrderTimeline";
import { FoodVariant } from "../models/FoodVariant";
import { User } from "../models/User";
import { StockDeductionService } from "./stockDeductionService";
import { generateOrderNumber } from "../utils/generateOrderNumber";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";
import { ORDER_STATUS_TRANSITIONS } from "../constants/order";
import { NotificationService } from "../modules/notification/services/notification.service";
import { NotificationType, NotificationChannel } from "../modules/notification/constants/notification";
import { RealtimeService } from "../modules/realtime/services/realtime.service";
import { SocketEvent } from "../modules/realtime/constants/events";
import { logger } from "../utils/logger";

export class OrderService {

    private static async validateItems(items: Array<{ foodVariant: string, quantity: number }>, session?: any) {
        // Rule 4: No duplicate variants inside one order
        const variantIds = items.map(i => i.foodVariant);
        const uniqueVariantIds = new Set(variantIds);
        if (uniqueVariantIds.size !== items.length) {
            throw new ValidationError("Duplicate variants inside one order are not allowed");
        }

        const resolvedItems = [];
        for (const item of items) {
            // Rule 1: Every Variant must exist
            const variantObj = await FoodVariant.findOne({
                _id: item.foodVariant,
                isDeleted: false
            }).session(session).populate("food");

            if (!variantObj) {
                throw new NotFoundError("Food variant not found");
            }

            // Rule 2: Variant must be available
            if (!variantObj.isAvailable) {
                throw new ValidationError(`Variant ${variantObj.name} is not available`);
            }

            const foodObj = variantObj.food as any;
            if (!foodObj || foodObj.isDeleted || foodObj.status !== "Published" || !foodObj.isAvailable) {
                throw new ValidationError(`Food item for variant ${variantObj.name} is not available`);
            }

            // Snapshot structure
            resolvedItems.push({
                food: foodObj._id,
                variant: variantObj._id,
                foodName: foodObj.name,
                variantName: variantObj.name,
                unitPrice: variantObj.price,
                quantity: item.quantity,
                totalPrice: variantObj.price * item.quantity
            });
        }

        return resolvedItems;
    }

    private static calculateTotals(resolvedItems: any[], discount: number, tax: number) {
        // Rule 5: Totals are always calculated on the backend
        const subtotal = resolvedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        const grandTotal = Math.max(0, subtotal + tax - discount);
        return { subtotal, grandTotal };
    }

    private static async createOrder(orderNumber: string, customerId: string | undefined, resolvedItems: any[], totals: any, notes: string | undefined, userId: string | undefined, session?: any) {
        const [newOrder] = await Order.create([{
            orderNumber,
            customer: customerId,
            items: resolvedItems,
            subtotal: totals.subtotal,
            tax: totals.tax,
            discount: totals.discount,
            grandTotal: totals.grandTotal,
            status: "Pending",
            paymentStatus: "Pending",
            notes,
            createdBy: userId,
            updatedBy: userId
        }], { session });

        return newOrder;
    }

    private static async createTimeline(
        orderId: any,
        oldStatus: string | null,
        newStatus: string,
        remarks?: string,
        userId?: string,
        session?: any
    ) {
        await OrderTimeline.create([{
            order: orderId,
            oldStatus,
            newStatus,
            remarks: remarks || "Order timeline initialised",
            updatedBy: userId
        }], { session });
    }

    static async placeOrder(
        data: { customer?: string, items: Array<{ foodVariant: string, quantity: number }>, notes?: string, discount?: number, tax?: number, createdBy?: string },
        externalSession?: mongoose.ClientSession
    ) {
        // Use external session if provided, otherwise start a new transaction
        const session = externalSession || await mongoose.startSession();
        if (!externalSession) {
            session.startTransaction();
        }

        try {
            // Validate customer exists if provided
            if (data.customer) {
                const customerExists = await User.exists({
                    _id: data.customer,
                    isDeleted: false
                }).session(session);

                if (!customerExists) {
                    throw new NotFoundError("Customer not found");
                }
            }

            // Rule 3: Validate quantity > 0, items non-empty
            if (!data.items || data.items.length === 0) {
                throw new ValidationError("At least one item is required");
            }
            for (const item of data.items) {
                if (item.quantity <= 0) {
                    throw new ValidationError("Quantity must be greater than 0");
                }
            }

            // Validate variants & compile snapshot
            const resolvedItems = await this.validateItems(data.items, session);

            // Calculate backend subtotal and grandTotal
            const discount = data.discount || 0;
            const tax = data.tax || 0;
            const { subtotal, grandTotal } = this.calculateTotals(resolvedItems, discount, tax);

            // Generate SOS formatted order number
            const orderNumber = await generateOrderNumber(session);

            // Note: Stock is no longer deducted here. It is deferred until payment is confirmed.

            // Save order document
            const newOrder = await this.createOrder(
                orderNumber,
                data.customer,
                resolvedItems,
                { subtotal, tax, discount, grandTotal },
                data.notes,
                data.createdBy,
                session
            );

            // Save timeline document
            await this.createTimeline(newOrder._id, null, "Pending", "Order placed", data.createdBy, session);

            if (!externalSession) {
                await session.commitTransaction();
            }

            // Fire Notification
            if (newOrder.customer) {
                NotificationService.send({
                    userId: newOrder.customer.toString(),
                    type: NotificationType.ORDER_PLACED,
                    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
                    title: "Order Placed",
                    message: `Your order ${newOrder.orderNumber} has been placed successfully.`,
                    metadata: { orderId: newOrder.orderNumber },
                    emailTemplate: "orderPlaced"
                }).catch(err => logger.error("Notification failed", { error: err.message }));
            }

            // Emit Realtime Event
            RealtimeService.emitToRoom('admin', SocketEvent.ORDER_CREATED, { order: newOrder });
            RealtimeService.emitToRoom('kitchen', SocketEvent.ORDER_CREATED, { order: newOrder });
            if (newOrder.customer) {
                RealtimeService.emitToRoom(`customer:${newOrder.customer.toString()}`, SocketEvent.ORDER_CREATED, { order: newOrder });
            }

            return newOrder;

        } catch (error) {
            if (!externalSession) {
                await session.abortTransaction();
            }
            throw error;
        } finally {
            if (!externalSession) {
                session.endSession();
            }
        }
    }

    static async updateStatus(data: { orderId: string, status: string, remarks?: string, updatedBy?: string }) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await Order.findOne({ _id: data.orderId, isDeleted: false }).session(session);
            if (!order) {
                throw new NotFoundError("Order not found");
            }

            const currentStatus = order.status;
            const newStatus = data.status;

            // Business Rule 1: Completed order cannot change status
            if (currentStatus === "Completed") {
                throw new ValidationError("Cannot change status of a completed order");
            }

            // Business Rule 2: Cancelled order cannot reopen
            if (currentStatus === "Cancelled") {
                throw new ValidationError("Cannot change status of a cancelled order");
            }

            // Validation of transition
            const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus as keyof typeof ORDER_STATUS_TRANSITIONS] || [];
            if (!allowedTransitions.includes(newStatus as any)) {
                throw new ValidationError(`Invalid status transition from ${currentStatus} to ${newStatus}`);
            }

            // Update timers
            if (newStatus === "Preparing") {
                order.timers.startedPreparingAt = new Date();
            } else if (newStatus === "Ready") {
                order.timers.readyAt = new Date();
            } else if (newStatus === "Completed") {
                order.timers.deliveredAt = new Date();
            }

            order.status = newStatus;
            if (data.updatedBy) {
                order.updatedBy = new mongoose.Types.ObjectId(data.updatedBy) as any;
            }

            await order.save({ session });

            // Create timeline entry
            await this.createTimeline(order._id, currentStatus, newStatus, data.remarks, data.updatedBy, session);

            await session.commitTransaction();

            // Fire Notification based on status
            if (order.customer && ["Preparing", "Ready", "Completed"].includes(newStatus)) {
                let type = NotificationType.ORDER_PREPARING;
                let title = "Order Preparing";
                let message = `Your order ${order.orderNumber} is now being prepared.`;
                let template = "orderPreparing";

                if (newStatus === "Ready") {
                    type = NotificationType.ORDER_READY;
                    title = "Order Ready";
                    message = `Your order ${order.orderNumber} is ready!`;
                    template = "orderReady";
                } else if (newStatus === "Completed") {
                    type = NotificationType.ORDER_COMPLETED;
                    title = "Order Completed";
                    message = `Your order ${order.orderNumber} has been delivered.`;
                    template = "orderCompleted";
                }

                NotificationService.send({
                    userId: order.customer.toString(),
                    type,
                    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
                    title,
                    message,
                    metadata: { orderId: order.orderNumber },
                    emailTemplate: template
                }).catch(err => logger.error("Notification failed", { error: err.message }));
            }

            // Emit Realtime Event
            RealtimeService.emitToRoom('admin', SocketEvent.ORDER_STATUS_UPDATED, { order });
            RealtimeService.emitToRoom('kitchen', SocketEvent.ORDER_STATUS_UPDATED, { order });
            if (order.customer) {
                RealtimeService.emitToRoom(`customer:${order.customer.toString()}`, SocketEvent.ORDER_STATUS_UPDATED, { order });
            }

            return order;

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async confirmOrder(orderId: string, session: mongoose.ClientSession) {
        const order = await Order.findOne({ orderNumber: orderId, isDeleted: false }).session(session);
        if (!order) throw new NotFoundError("Order not found");
        
        if (order.status !== "Pending") {
            throw new ValidationError("Order is not pending");
        }

        order.status = "Confirmed";
        order.paymentStatus = "Paid";
        await order.save({ session });

        await this.createTimeline(order._id, "Pending", "Confirmed", "Payment successful, order confirmed", undefined, session);

        // Deduct Stock
        for (const item of order.items) {
            await StockDeductionService.deductStockForVariant(
                item.variant.toString(),
                item.quantity,
                order.orderNumber,
                undefined,
                session
            );
        }

        if (order.customer) {
            NotificationService.send({
                userId: order.customer.toString(),
                type: NotificationType.ORDER_CONFIRMED,
                channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
                title: "Order Confirmed",
                message: `Your payment was successful and order ${order.orderNumber} is confirmed.`,
                metadata: { orderId: order.orderNumber },
                emailTemplate: "orderConfirmed"
            }, session).catch(err => logger.error("Notification failed", { error: err.message }));
        }
    }

    static async handlePaymentFailure(orderId: string, session: mongoose.ClientSession) {
        const order = await Order.findOne({ orderNumber: orderId, isDeleted: false }).session(session);
        if (!order) throw new NotFoundError("Order not found");

        order.paymentStatus = "Failed";
        await order.save({ session });
        
        await this.createTimeline(order._id, order.status, order.status, "Payment verification failed", undefined, session);
    }

    static async handlePaymentRefund(orderId: string, session: mongoose.ClientSession) {
        const order = await Order.findOne({ orderNumber: orderId, isDeleted: false }).session(session);
        if (!order) throw new NotFoundError("Order not found");

        order.paymentStatus = "Refunded";
        await order.save({ session });
        
        await this.createTimeline(order._id, order.status, order.status, "Payment refunded", undefined, session);
    }

    static async cancelOrder(orderId: string, reason: string, session: mongoose.ClientSession) {
        const order = await Order.findOne({ orderNumber: orderId, isDeleted: false }).session(session);
        if (!order) throw new NotFoundError("Order not found");

        const currentStatus = order.status;
        if (currentStatus === "Completed" || currentStatus === "Cancelled") {
            throw new ValidationError(`Cannot cancel order in ${currentStatus} state`);
        }

        order.status = "Cancelled";
        await order.save({ session });

        await this.createTimeline(order._id, currentStatus, "Cancelled", reason, undefined, session);
    }
}
