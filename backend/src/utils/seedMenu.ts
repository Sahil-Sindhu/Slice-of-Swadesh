import mongoose from "mongoose";
import { Category } from "../models/Category";
import { Food } from "../models/Food";
import { FoodVariant } from "../models/FoodVariant";
import "dotenv/config";

const categoriesData = [
  { name: "Pizza", slug: "pizza", displayOrder: 1 },
  { name: "Special Items", slug: "special-items", displayOrder: 2 },
  { name: "Maggie", slug: "maggie", displayOrder: 3 },
  { name: "Momos", slug: "momos", displayOrder: 4 },
  { name: "Sandwich", slug: "sandwich", displayOrder: 5 },
  { name: "Burger", slug: "burger", displayOrder: 6 },
  { name: "Fries", slug: "fries", displayOrder: 7 },
  { name: "Sauce Pasta", slug: "sauce-pasta", displayOrder: 8 },
  { name: "Hot Beverage", slug: "hot-beverage", displayOrder: 9 },
  { name: "Shakes", slug: "shakes", displayOrder: 10 },
  { name: "Ice Cream", slug: "ice-cream", displayOrder: 11 },
  { name: "Combos", slug: "combos", displayOrder: 12 }
];

const foodsData = [
  // Pizza
  { categorySlug: "pizza", name: "Onion / Corn / Tomato / Capsicum", slug: "onion-corn-tomato-capsicum", basePrice: 49, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 49 }, { name: "Medium", price: 99 }, { name: "Large", price: 199 }] },
  { categorySlug: "pizza", name: "Onion + Tomato + Capsicum + Corn", slug: "onion-tomato-capsicum-corn", basePrice: 59, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 59 }, { name: "Medium", price: 109 }, { name: "Large", price: 209 }] },
  { categorySlug: "pizza", name: "Onion + Tomato + Capsicum + Paneer", slug: "onion-tomato-capsicum-paneer", basePrice: 69, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 69 }, { name: "Medium", price: 119 }, { name: "Large", price: 219 }] },
  { categorySlug: "pizza", name: "Adjotic Pizza", slug: "adjotic-pizza", basePrice: 69, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 69 }, { name: "Medium", price: 119 }, { name: "Large", price: 219 }] },
  { categorySlug: "pizza", name: "Farm House Pizza", slug: "farm-house-pizza", basePrice: 69, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 69 }, { name: "Medium", price: 119 }, { name: "Large", price: 199 }] },
  { categorySlug: "pizza", name: "Margaret Pizza", slug: "margaret-pizza", basePrice: 69, foodType: "Veg" as const, preparationTime: 10, variants: [{ name: "Small", price: 69 }, { name: "Medium", price: 119 }, { name: "Large", price: 199 }] },
  { categorySlug: "pizza", name: "Achari Flavour Pizza", slug: "achari-flavour-pizza", basePrice: 79, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 79 }, { name: "Medium", price: 129 }, { name: "Large", price: 229 }] },
  { categorySlug: "pizza", name: "Makhani Paneer Pizza", slug: "makhani-paneer-pizza", basePrice: 79, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 79 }, { name: "Medium", price: 129 }, { name: "Large", price: 229 }] },
  { categorySlug: "pizza", name: "Peppy Paneer Pizza", slug: "peppy-paneer-pizza", basePrice: 79, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 79 }, { name: "Medium", price: 129 }, { name: "Large", price: 229 }] },
  { categorySlug: "pizza", name: "Spicy Mexican Pizza", slug: "spicy-mexican-pizza", basePrice: 79, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 79 }, { name: "Medium", price: 129 }, { name: "Large", price: 229 }] },
  { categorySlug: "pizza", name: "Chilli Paneer Pizza", slug: "chilli-paneer-pizza", basePrice: 79, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Small", price: 79 }, { name: "Medium", price: 129 }, { name: "Large", price: 229 }] },
  { categorySlug: "pizza", name: "Slice Of Swadesh Special Pizza", slug: "slice-of-swadesh-special-pizza", basePrice: 119, foodType: "Veg" as const, preparationTime: 15, isFeatured: true, variants: [{ name: "Small", price: 119 }, { name: "Medium", price: 239 }, { name: "Large", price: 359 }] },

  // Special Items
  { categorySlug: "special-items", name: "Cheese Ball", slug: "cheese-ball", basePrice: 60, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 60 }] },
  { categorySlug: "special-items", name: "Kulhad Pizza", slug: "kulhad-pizza", basePrice: 99, foodType: "Veg" as const, preparationTime: 10, variants: [{ name: "Regular", price: 99 }, { name: "Large", price: 119 }] },
  { categorySlug: "special-items", name: "Paneer Pops", slug: "paneer-pops", basePrice: 99, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 99 }] },
  { categorySlug: "special-items", name: "Cheese Garlic Bread (4pc)", slug: "cheese-garlic-bread-4pc", basePrice: 99, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 99 }] },

  // Maggie
  { categorySlug: "maggie", name: "Classic Maggie", slug: "classic-maggie", basePrice: 59, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 59 }] },
  { categorySlug: "maggie", name: "Veg Maggie", slug: "veg-maggie", basePrice: 69, foodType: "Veg" as const, preparationTime: 7, variants: [{ name: "Regular", price: 69 }] },
  { categorySlug: "maggie", name: "Cheese Maggie", slug: "cheese-maggie", basePrice: 79, foodType: "Veg" as const, preparationTime: 7, variants: [{ name: "Regular", price: 79 }] },
  { categorySlug: "maggie", name: "Paneer Maggie", slug: "paneer-maggie", basePrice: 89, foodType: "Veg" as const, preparationTime: 7, variants: [{ name: "Regular", price: 89 }] },

  // Momos
  { categorySlug: "momos", name: "Momos Steam", slug: "momos-steam", basePrice: 69, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 69 }] },
  { categorySlug: "momos", name: "Fried Momos", slug: "fried-momos", basePrice: 89, foodType: "Veg" as const, preparationTime: 9, variants: [{ name: "Regular", price: 89 }] },
  { categorySlug: "momos", name: "Steam Paneer Momos", slug: "steam-paneer-momos", basePrice: 99, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 99 }] },
  { categorySlug: "momos", name: "Kurkure Momos", slug: "kurkure-momos", basePrice: 109, foodType: "Veg" as const, preparationTime: 10, variants: [{ name: "Regular", price: 109 }] },
  { categorySlug: "momos", name: "Fried Paneer Momos", slug: "fried-paneer-momos", basePrice: 119, foodType: "Veg" as const, preparationTime: 9, variants: [{ name: "Regular", price: 119 }] },

  // Sandwich
  { categorySlug: "sandwich", name: "Alloo / Pyaj Grill Sandwich", slug: "alloo-pyaj-grill-sandwich", basePrice: 89, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 89 }] },
  { categorySlug: "sandwich", name: "Cold Sandwich", slug: "cold-sandwich", basePrice: 79, foodType: "Veg" as const, preparationTime: 5, variants: [{ name: "Regular", price: 79 }] },
  { categorySlug: "sandwich", name: "Veg Sandwich", slug: "veg-sandwich", basePrice: 99, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 99 }] },
  { categorySlug: "sandwich", name: "Cheese Corn Sandwich", slug: "cheese-corn-sandwich", basePrice: 109, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 109 }] },
  { categorySlug: "sandwich", name: "Paneer Grill Sandwich", slug: "paneer-grill-sandwich", basePrice: 119, foodType: "Veg" as const, preparationTime: 9, variants: [{ name: "Regular", price: 119 }] },

  // Burger
  { categorySlug: "burger", name: "Allo Tikki Burger", slug: "allo-tikki-burger", basePrice: 39, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 39 }] },
  { categorySlug: "burger", name: "Fire House Burger", slug: "fire-house-burger", basePrice: 49, foodType: "Veg" as const, preparationTime: 10, variants: [{ name: "Regular", price: 49 }] },
  { categorySlug: "burger", name: "Veg Burger", slug: "veg-burger", basePrice: 59, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 59 }] },
  { categorySlug: "burger", name: "Paneer Fried Burger", slug: "paneer-fried-burger", basePrice: 79, foodType: "Veg" as const, preparationTime: 10, variants: [{ name: "Regular", price: 79 }] },
  { categorySlug: "burger", name: "Slice Of Swadesh (Special) Burger", slug: "slice-of-swadesh-special-burger", basePrice: 89, foodType: "Veg" as const, preparationTime: 12, isFeatured: true, variants: [{ name: "Regular", price: 89 }] },

  // Fries
  { categorySlug: "fries", name: "Salted Fries", slug: "salted-fries", basePrice: 59, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 59 }] },
  { categorySlug: "fries", name: "Peri Peri Fries", slug: "peri-peri-fries", basePrice: 79, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 79 }] },
  { categorySlug: "fries", name: "Loaded Cheese Fries", slug: "loaded-cheese-fries", basePrice: 99, foodType: "Veg" as const, preparationTime: 8, variants: [{ name: "Regular", price: 99 }] },

  // Sauce Pasta
  { categorySlug: "sauce-pasta", name: "White Sauce Pasta", slug: "white-sauce-pasta", basePrice: 99, foodType: "Veg" as const, preparationTime: 10, variants: [{ name: "Regular", price: 99 }] },
  { categorySlug: "sauce-pasta", name: "Red Sauce Pasta", slug: "red-sauce-pasta", basePrice: 109, foodType: "Veg" as const, preparationTime: 10, variants: [{ name: "Regular", price: 109 }] },

  // Hot Beverage
  { categorySlug: "hot-beverage", name: "Plain Tea", slug: "plain-tea", basePrice: 19, foodType: "Veg" as const, preparationTime: 5, variants: [{ name: "Regular", price: 19 }] },
  { categorySlug: "hot-beverage", name: "Kulhad Simple Tea", slug: "kulhad-simple-tea", basePrice: 29, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 29 }] },
  { categorySlug: "hot-beverage", name: "Adrak + Elaichi Tea", slug: "adrak-elaichi-tea", basePrice: 29, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 29 }] },
  { categorySlug: "hot-beverage", name: "Kulhad Special Adrak Elaichi Tea", slug: "kulhad-special-adrak-elaichi-tea", basePrice: 39, foodType: "Veg" as const, preparationTime: 7, variants: [{ name: "Regular", price: 39 }] },
  { categorySlug: "hot-beverage", name: "Plain Coffee", slug: "plain-coffee", basePrice: 39, foodType: "Veg" as const, preparationTime: 5, variants: [{ name: "Regular", price: 39 }] },
  { categorySlug: "hot-beverage", name: "Kulhad Special Coffee", slug: "kulhad-special-coffee", basePrice: 49, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 49 }] },
  { categorySlug: "hot-beverage", name: "Slice Of Swadesh Special Coffee", slug: "slice-of-swadesh-special-coffee", basePrice: 59, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 59 }] },

  // Shakes
  { categorySlug: "shakes", name: "Cold Coffee", slug: "cold-coffee-shake", basePrice: 79, foodType: "Veg" as const, preparationTime: 5, variants: [{ name: "Regular", price: 79 }, { name: "Large", price: 89 }] },
  { categorySlug: "shakes", name: "Oreo Shake", slug: "oreo-shake", basePrice: 89, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 89 }, { name: "Large", price: 99 }] },
  { categorySlug: "shakes", name: "Butter Scotch Shake", slug: "butter-scotch-shake", basePrice: 99, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 99 }, { name: "Large", price: 109 }] },
  { categorySlug: "shakes", name: "Kit Kat Shake", slug: "kit-kat-shake", basePrice: 99, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 99 }, { name: "Large", price: 109 }] },
  { categorySlug: "shakes", name: "Chocolate Shake", slug: "chocolate-shake", basePrice: 99, foodType: "Veg" as const, preparationTime: 6, variants: [{ name: "Regular", price: 99 }, { name: "Large", price: 109 }] },

  // Ice Cream
  { categorySlug: "ice-cream", name: "Vanilla Ice Cream", slug: "vanilla-ice-cream", basePrice: 49, foodType: "Veg" as const, preparationTime: 3, variants: [{ name: "Regular", price: 49 }, { name: "Large", price: 69 }] },
  { categorySlug: "ice-cream", name: "Strawberry Ice Cream", slug: "strawberry-ice-cream", basePrice: 49, foodType: "Veg" as const, preparationTime: 3, variants: [{ name: "Regular", price: 49 }, { name: "Large", price: 69 }] },
  { categorySlug: "ice-cream", name: "Butter Scotch Ice Cream", slug: "butter-scotch-ice-cream", basePrice: 59, foodType: "Veg" as const, preparationTime: 3, variants: [{ name: "Regular", price: 59 }, { name: "Large", price: 79 }] },
  { categorySlug: "ice-cream", name: "Chocolate Ice Cream", slug: "chocolate-ice-cream", basePrice: 69, foodType: "Veg" as const, preparationTime: 3, variants: [{ name: "Regular", price: 69 }, { name: "Large", price: 89 }] },
  { categorySlug: "ice-cream", name: "Black Currant Ice Cream", slug: "black-currant-ice-cream", basePrice: 69, foodType: "Veg" as const, preparationTime: 3, variants: [{ name: "Regular", price: 69 }, { name: "Large", price: 89 }] },
  { categorySlug: "ice-cream", name: "Mix Ice Cream", slug: "mix-ice-cream", basePrice: 69, foodType: "Veg" as const, preparationTime: 3, variants: [{ name: "Regular", price: 69 }, { name: "Large", price: 89 }] },

  // Combos
  { categorySlug: "combos", name: "Combo - 89", slug: "combo-89", description: "Veg + Paneer Pizza + Cold Drink", basePrice: 89, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Regular", price: 89 }] },
  { categorySlug: "combos", name: "Combo - 129", slug: "combo-129", description: "Veg Pizza + Cold Coffee", basePrice: 129, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Regular", price: 129 }] },
  { categorySlug: "combos", name: "Combo - 139", slug: "combo-139", description: "Veg + Paneer Pizza + Cold Coffee", basePrice: 139, foodType: "Veg" as const, preparationTime: 12, variants: [{ name: "Regular", price: 139 }] },
  { categorySlug: "combos", name: "Combo - 149", slug: "combo-149", description: "1 Makhani Paneer Pizza + 1 Cold Coffee", basePrice: 149, foodType: "Veg" as const, preparationTime: 14, variants: [{ name: "Regular", price: 149 }] },
  { categorySlug: "combos", name: "Combo - 289", slug: "combo-289", description: "2 Cold Coffee + 2 Burger + 1 Simple Maggie", basePrice: 289, foodType: "Veg" as const, preparationTime: 15, variants: [{ name: "Regular", price: 289 }] },
  { categorySlug: "combos", name: "Single Combo - 300", slug: "single-combo-300", description: "1 Red Pasta + 1 Veg Sandwich + 1 All Veg Pizza + 1 Veg Burger Topping + Small Cold Drink", basePrice: 300, foodType: "Veg" as const, preparationTime: 18, variants: [{ name: "Regular", price: 300 }] },
  { categorySlug: "combos", name: "Double Combo - 349", slug: "double-combo-349", description: "2 Cold Coffee + 1 Grilled Sandwich + 1 Veggie Maggi + 1 Salted Fries", basePrice: 349, foodType: "Veg" as const, preparationTime: 18, variants: [{ name: "Regular", price: 349 }] }
];

const imageMap: Record<string, string> = {
  // Category fallbacks
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  "special-items": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
  maggie: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
  momos: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
  "sauce-pasta": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
  "hot-beverage": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
  shakes: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
  "ice-cream": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80",
  combos: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",

  // Specific items (Optional override)
  "onion-corn-tomato-capsicum": "https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=600&q=80",
  "farm-house-pizza": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
  "peppy-paneer-pizza": "https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?auto=format&fit=crop&w=600&q=80",
  "slice-of-swadesh-special-pizza": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
  "kulhad-pizza": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80",
  "cheese-garlic-bread-4pc": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80",
  "salted-fries": "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80",
  "white-sauce-pasta": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
  "oreo-shake": "https://images.unsplash.com/photo-1532713031318-db2d14e4b3e1?auto=format&fit=crop&w=600&q=80",
  "kit-kat-shake": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80",
  "vanilla-ice-cream": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80",
  "chocolate-ice-cream": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
};

async function seed() {
  const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/slice-of-swadesh";
  console.log("Connecting to MongoDB for menu seeding...");
  await mongoose.connect(connString);
  console.log("Connected to MongoDB.");

  // Clear existing items in these categories
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

    const imageUrl = imageMap[f.slug] || imageMap[f.categorySlug] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80";

    const createdFood = await Food.create({
      name: f.name,
      slug: f.slug,
      description: f.description || "",
      basePrice: f.basePrice,
      category: new mongoose.Types.ObjectId(categoryId),
      images: [{ url: imageUrl, alt: f.name }],
      foodType: f.foodType,
      isAvailable: true,
      preparationTime: f.preparationTime,
      isFeatured: f.isFeatured || false,
      isBestSeller: false,
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
