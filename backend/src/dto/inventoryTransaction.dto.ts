import { z } from "zod";

export const stockTransactionSchema = z.object({
    inventory: z.string(),
    quantity: z.number().positive(),
    remarks: z.string().optional()
});

export const adjustStockSchema = z.object({
    inventory: z.string(),
    quantity: z.number().nonnegative(),
    remarks: z.string().optional()
});
