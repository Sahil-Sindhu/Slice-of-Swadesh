import { z } from "zod";

export const createRecipeSchema = z.object({
    foodVariant: z.string(),
    ingredient: z.string(),
    quantity: z.number().positive()
});

export const updateRecipeSchema = createRecipeSchema.partial();

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
