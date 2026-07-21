import mongoose from "mongoose";
import { Category } from "../models/Category";
import { Food } from "../models/Food";
import { FoodVariant } from "../models/FoodVariant";
import "dotenv/config";

async function clearMenu() {
  const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/slice-of-swadesh";
  console.log("Connecting to MongoDB to clear menu...");
  await mongoose.connect(connString);
  console.log("Connected to MongoDB.");

  const categoriesDeleted = await Category.deleteMany({});
  const foodsDeleted = await Food.deleteMany({});
  const variantsDeleted = await FoodVariant.deleteMany({});

  console.log(`Deleted ${categoriesDeleted.deletedCount} categories.`);
  console.log(`Deleted ${foodsDeleted.deletedCount} foods.`);
  console.log(`Deleted ${variantsDeleted.deletedCount} variants.`);

  console.log("Database menu collections have been completely cleared! 🗑️");
  await mongoose.disconnect();
}

clearMenu().catch(err => {
  console.error("Failed to clear database menu:", err);
  process.exit(1);
});
