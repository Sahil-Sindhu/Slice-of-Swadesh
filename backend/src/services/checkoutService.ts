import mongoose from "mongoose";
import { CartService } from "./cartService";
import { OrderService } from "./orderService";
import { FoodVariant } from "../models/FoodVariant";
import { ICart } from "../models/Cart";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";
import { PaymentService } from "../modules/payment/services/payment.service";

export class CheckoutService {

    private static validateCart(cart: ICart) {
        if (!cart.items || cart.items.length === 0) {
            throw new ValidationError("Cart is empty");
        }
    }

    private static async refreshPrices(cart: ICart) {
        for (const item of cart.items) {
            const variant = await FoodVariant.findOne({ _id: item.variant, isDeleted: false }).populate("food");
            if (!variant) {
                throw new NotFoundError("Food variant not found");
            }
            if (!variant.isAvailable) {
                throw new ValidationError(`Variant ${variant.name} is not available`);
            }
            const food = variant.food as any;
            if (!food || food.isDeleted || food.status !== "Published" || !food.isAvailable) {
                throw new ValidationError(`Food item for variant ${variant.name} is not available`);
            }

            // Sync snapshot fields
            item.unitPrice = variant.price;
            item.foodName = food.name;
            item.variantName = variant.name;
        }
    }

    private static calculateTotals(cart: ICart) {
        for (const item of cart.items) {
            item.totalPrice = item.unitPrice * item.quantity;
        }
        cart.subtotal = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
        cart.discount = 0;
        cart.tax = 0;
        cart.grandTotal = Math.max(0, cart.subtotal + cart.tax - cart.discount);
    }

    private static async createOrder(cart: ICart, notes: string | undefined, session: mongoose.ClientSession) {
        // Map cart items to the input format of placeOrder
        const items = cart.items.map(item => ({
            foodVariant: item.variant.toString(),
            quantity: item.quantity
        }));

        return await OrderService.placeOrder({
            customer: cart.customer.toString(),
            items,
            notes,
            createdBy: cart.customer.toString()
        }, session);
    }

    private static async clearCart(customerId: string, session: mongoose.ClientSession) {
        await CartService.clearCart(customerId, session);
    }

    static async checkout(customerId: string, notes?: string) {
        // 1. Load Cart
        const cart = await CartService.getCart(customerId);

        // 2. Validate Cart
        this.validateCart(cart);

        // 3. Refresh Prices
        await this.refreshPrices(cart);

        // 4. Recalculate Totals
        this.calculateTotals(cart);

        // 5. Start Transaction Session
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Bind the pre-loaded cart to the transaction session and save
            cart.$session(session);
            await cart.save({ session });

            // 6. Create Order (Status: Pending)
            const order = await this.createOrder(cart, notes, session);

            // 7. Create Payment Intent via PaymentService
            const paymentIntent = await PaymentService.createPayment(order.orderNumber, customerId);

            // Note: We do NOT clear the cart here anymore. Cart is only cleared
            // upon successful payment (which should be triggered by the frontend/webhook).
            // For this implementation, we will let the frontend clear the cart upon success redirect.
            // Or we could clear it here, and restore it on failure, but for simplicity we keep it.
            
            // 8. Commit Transaction
            await session.commitTransaction();
            
            return {
                order,
                paymentIntent
            };

        } catch (error) {
            // 9. Abort Transaction
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

}
