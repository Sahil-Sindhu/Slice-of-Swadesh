import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { Food } from "../models/Food";
import { FoodVariant } from "../models/FoodVariant";
import { Ingredient } from "../models/Ingredient";
import { Recipe } from "../models/Recipe";
import { Inventory } from "../models/Inventory";
import { InventoryTransaction } from "../models/InventoryTransaction";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { CartService } from "../services/cartService";
import { CheckoutService } from "../services/checkoutService";

async function runVerification() {
    console.log("=========================================");
    console.log("🚀 STARTING E2E CUSTOMER FLOW VERIFICATION");
    console.log("=========================================\n");

    const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/slice-of-swadesh";
    await mongoose.connect(connString);
    console.log("✅ Connected to MongoDB");

    const testEmail = "e2e_customer@sliceofswadesh.com";

    // ─── STEP 0: CLEANUP & SETUP MASTER DATA ───
    await User.deleteMany({ email: testEmail });
    await Category.deleteMany({ slug: "e2e-category" });
    await Food.deleteMany({ slug: "e2e-burger" });
    // FoodVariant deleted in finally block to avoid complex queries here, or we can just delete by name
    await FoodVariant.deleteMany({ name: "Regular" });
    await Ingredient.deleteMany({ name: "Burger Bun" });
    await Order.deleteMany({ customer: null }); 
    
    // Create test user (Step 1)
    console.log("\n[Step 1] Register/Login Customer...");
    const customer = await User.create({
        email: testEmail,
        name: "E2E Customer",
        role: "customer"
    });
    console.log(`   Customer created: ${customer._id}`);

    // Create master data for menu
    const category = await Category.create({ name: "E2E Category", slug: "e2e-category", isDeleted: false });
    const food = await Food.create({
        name: "E2E Burger",
        slug: "e2e-burger",
        basePrice: 150,
        category: category._id,
        foodType: "Veg",
        isAvailable: true,
        preparationTime: 10,
        status: "Published",
        isDeleted: false
    });
    const variant = await FoodVariant.create({
        food: food._id,
        name: "Regular",
        price: 150,
        preparationTime: 10,
        isAvailable: true,
        isDeleted: false
    });

    // Create inventory items and recipes for deduction
    const ingredient = await Ingredient.create({
        name: "Burger Bun",
        unit: "pcs",
        isDeleted: false
    });
    await Inventory.create({
        ingredient: ingredient._id,
        currentStock: 100, // starting stock
        isDeleted: false
    });
    await Recipe.create({
        foodVariant: variant._id,
        ingredient: ingredient._id,
        quantity: 1
    });

    try {
        // ─── STEP 2: BROWSE MENU ───
        console.log("\n[Step 2] Browse Menu...");
        const menuFoods = await Food.find({ status: "Published", isDeleted: false });
        if (menuFoods.length === 0) throw new Error("Menu is empty");
        console.log(`   Found ${menuFoods.length} published foods on menu.`);

        // ─── STEP 3: OPEN FOOD ITEM ───
        console.log("\n[Step 3] Open a food item...");
        const selectedFood = await Food.findOne({ slug: "e2e-burger" });
        if (!selectedFood) throw new Error("Could not fetch specific food item");
        console.log(`   Opened food: ${selectedFood.name}`);

        // ─── STEP 4: SELECT VARIANT ───
        console.log("\n[Step 4] Select a variant...");
        const variants = await FoodVariant.find({ food: selectedFood._id });
        if (variants.length === 0) throw new Error("No variants found for food");
        const selectedVariant = variants[0];
        console.log(`   Selected variant: ${selectedVariant.name} (₹${selectedVariant.price})`);

        // ─── STEP 5: ADD TO CART ───
        console.log("\n[Step 5] Add it to the cart...");
        let cart = await CartService.addItem(customer._id.toString(), selectedVariant._id.toString(), 1);
        if (cart.items.length !== 1 || cart.items[0].quantity !== 1) throw new Error("Failed to add to cart properly");
        console.log(`   Added to cart. Cart subtotal: ₹${cart.subtotal}`);

        // ─── STEP 6: MODIFY QUANTITIES ───
        console.log("\n[Step 6] Modify quantities...");
        const cartItemId = (cart.items[0] as any)._id.toString();
        cart = await CartService.updateItem(customer._id.toString(), cartItemId, 3);
        if (cart.items[0].quantity !== 3 || cart.subtotal !== 450) throw new Error("Failed to update cart quantity");
        console.log(`   Quantity updated to 3. New subtotal: ₹${cart.subtotal}`);

        // ─── STEP 7: CHECKOUT ───
        console.log("\n[Step 7] Checkout...");
        const { order, paymentIntent } = await CheckoutService.checkout(customer._id.toString());
        if (!order || !order.orderNumber) throw new Error("Checkout failed to return an order");
        console.log(`   Checkout successful! Order created: ${order.orderNumber}`);

        // ─── STEP 8: CONFIRM ORDER APPEARS IN DATABASE ───
        console.log("\n[Step 8] Confirm the order appears in the database...");
        const fetchedOrder = await Order.findOne({ orderNumber: order.orderNumber });
        if (!fetchedOrder) throw new Error("Order not found in database");
        console.log(`   Order verified in DB. Status: ${fetchedOrder.status}, Grand Total: ₹${fetchedOrder.grandTotal}`);

        // ─── STEP 9: VERIFY INVENTORY IS REDUCED CORRECTLY ───
        console.log("\n[Step 9] Verify inventory is reduced correctly...");
        const updatedInventory = await Inventory.findOne({ ingredient: ingredient._id });
        // Start: 100, Deducted: 3 (qty) * 1 (bun) = 3. Remaining: 97
        if (!updatedInventory || updatedInventory.currentStock !== 97) {
            throw new Error(`Inventory deduction failed. Expected 97, got ${updatedInventory?.currentStock}`);
        }
        console.log(`   Inventory properly reduced. Burger Buns remaining: ${updatedInventory.currentStock} pcs.`);
        
        const tx = await InventoryTransaction.find({ remarks: order.orderNumber });
        if (tx.length === 0) throw new Error("No inventory transactions logged");
        console.log(`   Inventory transaction logged for order ${order.orderNumber}.`);

        // ─── STEP 10: VERIFY ORDER APPEARS IN KITCHEN QUEUE ───
        console.log("\n[Step 10] Verify the order appears in the kitchen queue...");
        // Kitchen queue logic: Orders with status "Pending" or "Preparing"
        const kitchenQueue = await Order.find({ status: { $in: ["Pending", "Preparing"] } });
        const inQueue = kitchenQueue.some(o => o.orderNumber === order.orderNumber);
        if (!inQueue) throw new Error("Order not found in Kitchen Queue");
        console.log(`   Order ${order.orderNumber} is actively in the Kitchen Queue.`);

        console.log("\n=========================================");
        console.log("🎉 ALL 10 CUSTOMER FLOW STEPS PASSED!");
        console.log("=========================================\n");

    } catch (error) {
        console.error("\n❌ VERIFICATION FAILED:");
        console.error(error);
        process.exitCode = 1;
    } finally {
        // Cleanup test data
        await User.deleteMany({ email: testEmail });
        await Category.deleteMany({ _id: category._id });
        await Food.deleteMany({ _id: food._id });
        await FoodVariant.deleteMany({ _id: variant._id });
        await Ingredient.deleteMany({ _id: ingredient._id });
        await Inventory.deleteMany({ ingredient: ingredient._id });
        await Recipe.deleteMany({ foodVariant: variant._id });
        await Cart.deleteMany({ customer: customer._id });
        await Order.deleteMany({ customer: customer._id });
        
        await mongoose.disconnect();
    }
}

runVerification();
