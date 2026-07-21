import { z } from "zod";

const orderItemInputSchema = z.object({
    foodVariant: z.string(),
    quantity: z.number().int().positive()
});

export const createOrderSchema = z.object({
    customer: z.string().optional(),
    items: z.array(orderItemInputSchema).nonempty("At least one item is required."),
    notes: z.string().optional(),
    discount: z.number().min(0).default(0),
    tax: z.number().min(0).default(0)
});

export const updateOrderStatusSchema = z.object({
    status: z.enum([
        "Pending",
        "Confirmed",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled"
    ]),
    remarks: z.string().optional(),
    paymentStatus: z.enum([
        "Pending",
        "Paid",
        "Failed",
        "Refunded"
    ]).optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
