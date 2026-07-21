import { z } from "zod";

export const createFoodSchema = z.object({
  name: z
    .string()
    .min(2, "Food name must be at least 2 characters"),

  description: z
    .string()
    .optional(),

  basePrice: z
    .number()
    .positive("Base price must be greater than zero"),

  category: z
    .string()
    .min(1, "Category is required"),

  subCategory: z
    .string()
    .optional(),

  images: z
    .array(
      z.object({
        url: z.string().min(1, "Image URL is required"),
        alt: z.string().optional().default(""),
      })
    )
    .default([]),

  foodType: z.enum([
    "Veg",
    "NonVeg",
    "Vegan",
    "Jain",
    "Egg"
  ]),

  preparationTime: z
    .number()
    .min(1),

  isAvailable: z
    .boolean()
    .default(true),

  isFeatured: z
    .boolean()
    .default(false),

  isBestSeller: z
    .boolean()
    .default(false),

  status: z
    .enum(["Draft", "Published", "Archived"])
    .default("Published"),

  displayOrder: z
    .number()
    .default(0),

  tags: z
    .array(z.string())
    .default([])
});

export const updateFoodSchema = createFoodSchema.partial();

export type CreateFoodInput = z.infer<typeof createFoodSchema>;
export type UpdateFoodInput = z.infer<typeof updateFoodSchema>;
