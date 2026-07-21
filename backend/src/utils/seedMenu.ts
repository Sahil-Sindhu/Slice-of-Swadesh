import mongoose from "mongoose";
import { Category } from "../models/Category";
import { Food } from "../models/Food";
import { FoodVariant } from "../models/FoodVariant";
import "dotenv/config";

const categoriesData = [
  {
    name: "Naan Pizza",
    slug: "naan-pizza",
    description: "Premium fusion Pizzas baked on fresh, soft hand-stretched Naan bread.",
    displayOrder: 1
  },
  {
    name: "Fusion Burgers",
    slug: "fusion-burgers",
    description: "Juicy artisanal burgers crafted with traditional Indian spices and gourmet fillings.",
    displayOrder: 2
  },
  {
    name: "Desi Pastas",
    slug: "desi-pastas",
    description: "Penne pasta sautéed in rich, aromatic butter chicken or paneer makhani gravies.",
    displayOrder: 3
  },
  {
    name: "Indian Drinks & Desserts",
    slug: "drinks-desserts",
    description: "Creamy lassis, spice-infused milkshakes, and traditional desserts with a twist.",
    displayOrder: 4
  }
];

const foodsData = [
  {
    categorySlug: "naan-pizza",
    name: "Tandoori Paneer Naan Pizza",
    slug: "tandoori-paneer-naan-pizza",
    description: "Soft naan crust topped with spiced tandoori paneer cubes, colored bell peppers, mozzarella cheese, and fresh cilantro drizzle.",
    basePrice: 340,
    foodType: "Veg" as const,
    preparationTime: 12,
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { name: "Regular", price: 340 },
      { name: "Large", price: 490 }
    ]
  },
  {
    categorySlug: "naan-pizza",
    name: "Butter Chicken Naan Pizza",
    slug: "butter-chicken-naan-pizza",
    description: "Creamy butter chicken gravy, succulent shredded chicken tikka, and dynamic red onions on fresh naan crust.",
    basePrice: 380,
    foodType: "NonVeg" as const,
    preparationTime: 14,
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { name: "Regular", price: 380 },
      { name: "Large", price: 540 }
    ]
  },
  {
    categorySlug: "fusion-burgers",
    name: "Spiced Cardamom Beef Burger",
    slug: "spiced-cardamom-beef-burger",
    description: "Gourmet beef patty seasoned with ground cardamom and ginger, topped with onion bhaji, cheddar cheese, and mango chutney mayo.",
    basePrice: 390,
    foodType: "NonVeg" as const,
    preparationTime: 15,
    isFeatured: true,
    isBestSeller: false,
    variants: [
      { name: "Regular", price: 390 },
      { name: "Double Patty", price: 490 }
    ]
  },
  {
    categorySlug: "desi-pastas",
    name: "Makhani Penne Pasta",
    slug: "makhani-penne-pasta",
    description: "Al dente penne pasta tossed in a signature creamy tomato makhani sauce, topped with grated paneer and kasuri methi.",
    basePrice: 290,
    foodType: "Veg" as const,
    preparationTime: 10,
    isFeatured: false,
    isBestSeller: true,
    variants: [
      { name: "Regular", price: 290 }
    ]
  },
  {
    categorySlug: "drinks-desserts",
    name: "Saffron Mango Lassi",
    slug: "saffron-mango-lassi",
    description: "Creamy yogurt blend infused with sweet alphonso mango pulp, green cardamom powder, and premium saffron strands.",
    basePrice: 160,
    foodType: "Veg" as const,
    preparationTime: 5,
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { name: "Single Size", price: 160 }
    ]
  }
];

async function seed() {
  const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/slice-of-swadesh";
  console.log("Connecting to MongoDB for menu seeding...");
  await mongoose.connect(connString);
  console.log("Connected to MongoDB.");

  const categorySlugs = categoriesData.map(c => c.slug);
  await Category.deleteMany({ slug: { $in: categorySlugs } });
  
  const foodSlugs = foodsData.map(f => f.slug);
  const existingFoods = await Food.find({ slug: { $in: foodSlugs } });
  const existingFoodIds = existingFoods.map(ef => ef._id);
  await Food.deleteMany({ slug: { $in: foodSlugs } });
  await FoodVariant.deleteMany({ food: { $in: existingFoodIds } });

  console.log("Cleared existing items with matching slugs.");

  const categoryIdMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await Category.create({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      displayOrder: cat.displayOrder,
      isActive: true,
      level: 0
    });
    categoryIdMap[cat.slug] = createdCat._id.toString();
    console.log(`Created Category: ${createdCat.name}`);
  }

  for (const f of foodsData) {
    const categoryId = categoryIdMap[f.categorySlug];
    if (!categoryId) {
      console.warn(`Category slug ${f.categorySlug} not found. Skipping.`);
      continue;
    }

    const createdFood = await Food.create({
      name: f.name,
      slug: f.slug,
      description: f.description,
      basePrice: f.basePrice,
      category: new mongoose.Types.ObjectId(categoryId),
      foodType: f.foodType,
      isAvailable: true,
      preparationTime: f.preparationTime,
      isFeatured: f.isFeatured,
      isBestSeller: f.isBestSeller,
      status: "Published",
      isDeleted: false
    });

    console.log(`Created Food Item: ${createdFood.name}`);

    for (const v of f.variants) {
      const createdVariant = await FoodVariant.create({
        food: createdFood._id,
        name: v.name,
        price: v.price,
        preparationTime: f.preparationTime,
        isAvailable: true
      });
      console.log(`  -> Variant: ${createdVariant.name} (₹${createdVariant.price})`);
    }
  }

  console.log("\nMenu seeding completed successfully! 🎉");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
