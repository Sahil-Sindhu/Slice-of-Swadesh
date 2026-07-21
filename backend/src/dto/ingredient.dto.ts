import { z } from "zod";

export const createIngredientSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    unit: z.enum([
        "g",
        "kg",
        "ml",
        "l",
        "pcs"
    ]),
    minimumStock: z.number().min(0),
    isActive: z.boolean().default(true)
});

export const updateIngredientSchema = createIngredientSchema.partial();

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
