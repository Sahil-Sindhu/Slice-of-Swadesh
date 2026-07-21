import { z } from "zod";

export const createVariantSchema = z.object({
    food: z.string(),
    name: z.string().min(1),
    price: z.number().positive(),
    preparationTime: z.number().min(1),
    isAvailable: z.boolean().default(true),
    displayOrder: z.number().default(0)
});

export const updateVariantSchema = createVariantSchema.partial();

export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
