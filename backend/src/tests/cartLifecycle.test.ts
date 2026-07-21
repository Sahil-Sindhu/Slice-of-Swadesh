import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../models/User";
import { Food } from "../models/Food";
import { FoodVariant } from "../models/FoodVariant";
import { Cart } from "../models/Cart";
import { CartService } from "../services/cartService";

async function runTests() {
    console.log("Connecting to database...");
    const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/slice-of-swadesh";
    await mongoose.connect(connString);
    console.log("Connected to MongoDB.");

    const testEmail = "testcustomer@sliceofswadesh.com";
    
    // Cleanup prior test artifacts
    await User.deleteMany({ email: testEmail });
    await Food.deleteMany({ name: "Test Pizza Core" });
    await FoodVariant.deleteMany({ name: { $in: ["Large Pizza", "Medium Pizza"] } });

    // Setup master data
    const user = await User.create({
        email: testEmail,
        name: "Test Customer",
        role: "customer"
    });

    const categoryId = new mongoose.Types.ObjectId();
    const food = await Food.create({
        name: "Test Pizza Core",
        slug: "test-pizza-core",
        basePrice: 200,
        category: categoryId,
        images: [{ url: "http://example.com/pizza.jpg" }],
        foodType: "Veg",
        isAvailable: true,
        preparationTime: 15,
        isFeatured: false,
        isBestSeller: false,
        status: "Published",
        displayOrder: 1,
        tags: ["pizza"],
        rating: 4.5,
        ratingCount: 10,
        isDeleted: false
    });

    // Create two variants
    const largeVariant = await FoodVariant.create({
        food: food._id,
        name: "Large Pizza",
        price: 350,
        preparationTime: 15,
        isAvailable: true,
        isDeleted: false
    });

    const mediumVariant = await FoodVariant.create({
        food: food._id,
        name: "Medium Pizza",
        price: 250,
        preparationTime: 12,
        isAvailable: true,
        isDeleted: false
    });

    const customerId = user._id.toString();

    // Clean any prior cart for safety
    await Cart.deleteMany({ customer: customerId });

    try {
        console.log("\n--- Scenario 1: Add First Item (Large Pizza, Qty 2) ---");
        let cart = await CartService.addItem(customerId, largeVariant._id.toString(), 2);
        
        console.log(`Cart items length: ${cart.items.length}`);
        console.log(`Subtotal: ${cart.subtotal}, GrandTotal: ${cart.grandTotal}`);
        
        if (cart.items.length !== 1) {
            throw new Error(`Expected 1 item, got ${cart.items.length}`);
        }
        if (cart.items[0].quantity !== 2) {
            throw new Error(`Expected quantity 2, got ${cart.items[0].quantity}`);
        }
        if (cart.subtotal !== 700 || cart.grandTotal !== 700) {
            throw new Error(`Expected totals to be 700, got subtotal=${cart.subtotal}, grandTotal=${cart.grandTotal}`);
        }
        console.log("Scenario 1 Passed.");


        console.log("\n--- Scenario 2: Add Same Variant Again (Large Pizza, Qty 1) ---");
        cart = await CartService.addItem(customerId, largeVariant._id.toString(), 1);
        
        console.log(`Cart items length: ${cart.items.length}`);
        console.log(`First item quantity: ${cart.items[0].quantity}`);
        console.log(`Subtotal: ${cart.subtotal}, GrandTotal: ${cart.grandTotal}`);

        if (cart.items.length !== 1) {
            throw new Error(`Expected items count to remain 1, got ${cart.items.length}`);
        }
        if (cart.items[0].quantity !== 3) {
            throw new Error(`Expected merged quantity to be 3, got ${cart.items[0].quantity}`);
        }
        if (cart.subtotal !== 1050 || cart.grandTotal !== 1050) {
            throw new Error(`Expected totals to be 1050, got subtotal=${cart.subtotal}, grandTotal=${cart.grandTotal}`);
        }
        console.log("Scenario 2 Passed.");


        console.log("\n--- Scenario 3: Add Different Variant (Medium Pizza, Qty 2) ---");
        cart = await CartService.addItem(customerId, mediumVariant._id.toString(), 2);

        console.log(`Cart items length: ${cart.items.length}`);
        console.log(`Subtotal: ${cart.subtotal}, GrandTotal: ${cart.grandTotal}`);

        if (cart.items.length !== 2) {
            throw new Error(`Expected 2 items in cart, got ${cart.items.length}`);
        }
        // Subtotal = 3 * 350 + 2 * 250 = 1050 + 500 = 1550
        if (cart.subtotal !== 1550 || cart.grandTotal !== 1550) {
            throw new Error(`Expected totals to be 1550, got subtotal=${cart.subtotal}, grandTotal=${cart.grandTotal}`);
        }
        console.log("Scenario 3 Passed.");


        console.log("\n--- Scenario 4: Update Quantity (Medium Pizza updated to Qty 5) ---");
        // Get the itemId for the Medium Pizza item
        const mediumItem = cart.items.find(i => i.variant.toString() === mediumVariant._id.toString());
        if (!mediumItem) throw new Error("Medium Pizza item not found in cart");
        const itemId = (mediumItem as any)._id.toString();

        cart = await CartService.updateItem(customerId, itemId, 5);
        const updatedMediumItem = cart.items.find(i => i.variant.toString() === mediumVariant._id.toString());
        
        console.log(`Updated item quantity: ${updatedMediumItem?.quantity}`);
        console.log(`Subtotal: ${cart.subtotal}, GrandTotal: ${cart.grandTotal}`);

        if (updatedMediumItem?.quantity !== 5) {
            throw new Error(`Expected quantity 5, got ${updatedMediumItem?.quantity}`);
        }
        // Subtotal = 3 * 350 + 5 * 250 = 1050 + 1250 = 2300
        if (cart.subtotal !== 2300 || cart.grandTotal !== 2300) {
            throw new Error(`Expected totals to be 2300, got subtotal=${cart.subtotal}, grandTotal=${cart.grandTotal}`);
        }
        console.log("Scenario 4 Passed.");


        console.log("\n--- Scenario 5: Remove Item (Remove Large Pizza) ---");
        const largeItem = cart.items.find(i => i.variant.toString() === largeVariant._id.toString());
        if (!largeItem) throw new Error("Large Pizza item not found in cart");
        const largeItemId = (largeItem as any)._id.toString();

        cart = await CartService.removeItem(customerId, largeItemId);

        console.log(`Cart items length: ${cart.items.length}`);
        console.log(`Subtotal: ${cart.subtotal}, GrandTotal: ${cart.grandTotal}`);

        if (cart.items.length !== 1) {
            throw new Error(`Expected 1 item, got ${cart.items.length}`);
        }
        if (cart.items[0].variant.toString() !== mediumVariant._id.toString()) {
            throw new Error("Expected only Medium Pizza to remain in cart");
        }
        // Subtotal = 5 * 250 = 1250
        if (cart.subtotal !== 1250 || cart.grandTotal !== 1250) {
            throw new Error(`Expected totals to be 1250, got subtotal=${cart.subtotal}, grandTotal=${cart.grandTotal}`);
        }
        console.log("Scenario 5 Passed.");


        console.log("\n--- Scenario 6: Clear Cart ---");
        cart = await CartService.clearCart(customerId);

        console.log(`Cart items length: ${cart.items.length}`);
        console.log(`Subtotal: ${cart.subtotal}, GrandTotal: ${cart.grandTotal}`);

        if (cart.items.length !== 0) {
            throw new Error(`Expected 0 items, got ${cart.items.length}`);
        }
        if (cart.subtotal !== 0 || cart.grandTotal !== 0) {
            throw new Error(`Expected totals to be 0, got subtotal=${cart.subtotal}, grandTotal=${cart.grandTotal}`);
        }
        console.log("Scenario 6 Passed.");

        console.log("\n🎉 ALL CART SCENARIOS PASSED SUCCESSFULLY!");

    } catch (error) {
        console.error("\n❌ Test Suite Failed with error:", error);
        process.exitCode = 1;
    } finally {
        console.log("Cleaning up test database records...");
        await Cart.deleteMany({ customer: customerId });
        await User.deleteMany({ email: testEmail });
        await Food.deleteMany({ name: "Test Pizza Core" });
        await FoodVariant.deleteMany({ name: { $in: ["Large Pizza", "Medium Pizza"] } });
        await mongoose.disconnect();
        console.log("Disconnected from database.");
    }
}

runTests();
