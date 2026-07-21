import { z } from "zod";

export const createInventorySchema = z.object({
    ingredient: z.string(),
    currentStock: z.number().min(0),
    reservedStock: z.number().min(0).default(0)
});

export const updateInventorySchema = createInventorySchema.partial();

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
