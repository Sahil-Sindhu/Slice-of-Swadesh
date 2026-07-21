import { z } from "zod";

export const addToCartSchema = z.object({
    variant: z.string({
        required_error: "Variant ID is required"
    }).min(1, "Variant ID cannot be empty"),
    quantity: z.number({
        required_error: "Quantity is required"
    }).int("Quantity must be an integer").min(1, "Quantity must be at least 1")
});

export const updateCartItemSchema = z.object({
    quantity: z.number({
        required_error: "Quantity is required"
    }).int("Quantity must be an integer").min(1, "Quantity must be at least 1")
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
