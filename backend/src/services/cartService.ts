import mongoose from "mongoose";
import { Cart, ICart } from "../models/Cart";
import { FoodVariant } from "../models/FoodVariant";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";

export class CartService {

    private static calculateTotals(cart: ICart) {
        // Recalculate item totals
        for (const item of cart.items) {
            item.totalPrice = item.unitPrice * item.quantity;
        }
        // Recalculate subtotal
        cart.subtotal = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
        // Initially 0 discount and tax
        cart.discount = 0;
        cart.tax = 0;
        // Update grandTotal
        cart.grandTotal = Math.max(0, cart.subtotal + cart.tax - cart.discount);
    }

    static async getCart(customerId: string, session?: mongoose.ClientSession): Promise<ICart> {
        let cart = await Cart.findOne({ customer: customerId }).session(session || null as any);
        if (!cart) {
            const [newCart] = await Cart.create([{
                customer: customerId,
                items: [],
                subtotal: 0,
                discount: 0,
                tax: 0,
                grandTotal: 0
            }], { session });
            cart = newCart;
        }
        return cart;
    }

    static async addItem(customerId: string, variantId: string, quantity: number): Promise<ICart> {
        if (quantity < 1) {
            throw new ValidationError("Quantity must be at least 1");
        }

        // Rule 4: Variant must exist
        const variant = await FoodVariant.findOne({ _id: variantId, isDeleted: false }).populate("food");
        if (!variant) {
            throw new NotFoundError("Food variant not found");
        }

        // Rule 5: Variant must be available
        if (!variant.isAvailable) {
            throw new ValidationError(`Variant ${variant.name} is not available`);
        }

        const food = variant.food as any;
        if (!food || food.isDeleted || food.status !== "Published" || !food.isAvailable) {
            throw new ValidationError(`Food item for variant ${variant.name} is not available`);
        }

        // Rule 1: One active cart per customer. Retrieve or create.
        const cart = await this.getCart(customerId);

        // Rule 2: Duplicate variant? Merge quantities
        const existingItem = cart.items.find(item => item.variant.toString() === variantId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                variant: variant._id,
                food: food._id,
                foodName: food.name,
                variantName: variant.name,
                unitPrice: variant.price,
                quantity: quantity,
                totalPrice: variant.price * quantity
            } as any);
        }

        this.calculateTotals(cart);
        await cart.save();
        return cart;
    }

    static async updateItem(customerId: string, itemId: string, quantity: number): Promise<ICart> {
        if (quantity < 1) {
            throw new ValidationError("Quantity must be at least 1");
        }

        const cart = await Cart.findOne({ customer: customerId });
        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        const item = cart.items.find(i => (i as any)._id.toString() === itemId);
        if (!item) {
            throw new NotFoundError("Cart item not found");
        }

        // Validate variant is still available
        const variant = await FoodVariant.findOne({ _id: item.variant, isDeleted: false }).populate("food");
        if (!variant || !variant.isAvailable) {
            throw new ValidationError("Variant is no longer available");
        }

        const food = variant.food as any;
        if (!food || food.isDeleted || food.status !== "Published" || !food.isAvailable) {
            throw new ValidationError("Food item is no longer available");
        }

        item.quantity = quantity;
        this.calculateTotals(cart);
        await cart.save();
        return cart;
    }

    static async removeItem(customerId: string, itemId: string): Promise<ICart> {
        const cart = await Cart.findOne({ customer: customerId });
        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(i => (i as any)._id.toString() !== itemId) as any;
        
        if (cart.items.length === initialLength) {
            throw new NotFoundError("Cart item not found");
        }

        this.calculateTotals(cart);
        await cart.save();
        return cart;
    }

    static async clearCart(customerId: string, session?: mongoose.ClientSession): Promise<ICart> {
        const cart = await this.getCart(customerId, session);
        cart.items = [];
        cart.subtotal = 0;
        cart.discount = 0;
        cart.tax = 0;
        cart.grandTotal = 0;
        
        await cart.save({ session });
        return cart;
    }

}
