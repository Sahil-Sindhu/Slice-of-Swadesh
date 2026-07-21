import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../models/User";
import { Food } from "../models/Food";
import { FoodVariant } from "../models/FoodVariant";
import { Ingredient } from "../models/Ingredient";
import { Inventory } from "../models/Inventory";
import { InventoryTransaction } from "../models/InventoryTransaction";
import { Recipe } from "../models/Recipe";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { OrderTimeline } from "../models/OrderTimeline";
import { CartService } from "../services/cartService";
import { OrderService } from "../services/orderService";
import { CheckoutService } from "../services/checkoutService";

async function runTests() {
    console.log("Connecting to database...");
    const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/slice-of-swadesh";
    await mongoose.connect(connString);
    console.log("Connected to MongoDB.");

    const testEmail = "checkoutcustomer@sliceofswadesh.com";
    
    // Clean up old artifacts
    await User.deleteMany({ email: testEmail });
    await Food.deleteMany({ name: "Checkout Pizza" });
    await FoodVariant.deleteMany({ name: { $in: ["Large Pizza", "Medium Pizza"] } });
    await Ingredient.deleteMany({ name: "Checkout Cheese" });
    await Recipe.deleteMany({}); // wipe recipes created for variants
    
    // Create customer user
    const user = await User.create({
        email: testEmail,
        name: "Checkout Customer",
        role: "customer"
    });
    const customerId = user._id.toString();

    // Create a Category ID
    const categoryId = new mongoose.Types.ObjectId();
    
    // Create Food
    const food = await Food.create({
        name: "Checkout Pizza",
        slug: "checkout-pizza",
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

    // Create Food Variants
    const largeVariant = await FoodVariant.create({
        food: food._id,
        name: "Large Pizza",
        price: 350, // Snapshot price is initially 350
        preparationTime: 15,
        isAvailable: true,
        isDeleted: false
    });

    // Create Ingredient
    const ingredient = await Ingredient.create({
        name: "Checkout Cheese",
        unit: "g",
        isDeleted: false
    });

    // Create Inventory for Ingredient (stock initially 1000g)
    const inventory = await Inventory.create({
        ingredient: ingredient._id,
        currentStock: 1000,
        reservedStock: 0,
        minStockLevel: 100,
        unit: "g",
        isDeleted: false
    });

    // Create Recipe (needs 100g of Cheese per Large Pizza)
    await Recipe.create({
        foodVariant: largeVariant._id,
        ingredient: ingredient._id,
        quantity: 100,
        isDeleted: false
    });

    // Setup helper to reset test cart and inventory stock
    const resetState = async (stock = 1000) => {
        await Cart.deleteMany({ customer: customerId });
        await Order.deleteMany({ customer: customerId });
        await OrderTimeline.deleteMany({});
        await InventoryTransaction.deleteMany({});
        
        await Inventory.updateOne({ _id: inventory._id }, { $set: { currentStock: stock } });
    };

    try {
        console.log("\n--- Test 1: Cart exists & Checkout succeeds (Happy Path) ---");
        await resetState(1000);
        
        // Add Large Pizza (Qty 2) to cart. Needs 2 * 100 = 200g cheese.
        await CartService.addItem(customerId, largeVariant._id.toString(), 2);
        
        const { order, paymentIntent } = await CheckoutService.checkout(customerId);
        console.log(`Checkout succeeded. Order created: ${order.orderNumber}, GrandTotal: ${order.grandTotal}`);

        // Verify Order & Timelines
        const orderDoc = await Order.findOne({ orderNumber: order.orderNumber });
        if (!orderDoc) throw new Error("Order was not saved in DB");
        if (orderDoc.grandTotal !== 700) throw new Error(`Expected GrandTotal 700, got ${orderDoc.grandTotal}`);

        const timelineCount = await OrderTimeline.countDocuments({ order: orderDoc._id });
        if (timelineCount !== 1) throw new Error(`Expected 1 timeline entry, got ${timelineCount}`);

        // Verify Stock Deducted
        const updatedInventory = await Inventory.findById(inventory._id);
        console.log(`Original Stock: 1000g, Remaining Stock: ${updatedInventory?.currentStock}g`);
        if (updatedInventory?.currentStock !== 800) {
            throw new Error(`Expected remaining stock to be 800g, got ${updatedInventory?.currentStock}g`);
        }

        // Verify Inventory Transactions Created
        const transactionCount = await InventoryTransaction.countDocuments({ inventory: inventory._id });
        if (transactionCount !== 1) throw new Error(`Expected 1 inventory transaction, got ${transactionCount}`);

        // Verify Cart Cleared
        const clearedCart = await CartService.getCart(customerId);
        if (clearedCart.items.length !== 0) throw new Error("Cart was not cleared after checkout");

        console.log("Test 1 Passed.");


        console.log("\n--- Test 2: Empty cart fails ---");
        await resetState();
        
        try {
            await CheckoutService.checkout(customerId);
            throw new Error("Expected checkout on empty cart to fail");
        } catch (err: any) {
            console.log(`Test 2 successfully failed with: "${err.message}"`);
        }
        console.log("Test 2 Passed.");


        console.log("\n--- Test 3: Deleted variant fails ---");
        await resetState();
        
        // Add item to cart
        await CartService.addItem(customerId, largeVariant._id.toString(), 1);
        
        // Soft delete variant
        largeVariant.isDeleted = true;
        await largeVariant.save();

        try {
            await CheckoutService.checkout(customerId);
            throw new Error("Expected checkout with deleted variant to fail");
        } catch (err: any) {
            console.log(`Test 3 successfully failed with: "${err.message}"`);
        }
        
        // Restore variant
        largeVariant.isDeleted = false;
        await largeVariant.save();
        console.log("Test 3 Passed.");


        console.log("\n--- Test 4: Out of stock fails and Cart remains unchanged ---");
        // Needs 200g, but stock set to 100g
        await resetState(100);
        
        // Add Large Pizza (Qty 2)
        await CartService.addItem(customerId, largeVariant._id.toString(), 2);

        try {
            await CheckoutService.checkout(customerId);
            throw new Error("Expected checkout with insufficient stock to fail");
        } catch (err: any) {
            console.log(`Test 4 successfully failed with: "${err.message}"`);
        }

        // Verify cart items remain unchanged
        const cartAfterFail = await CartService.getCart(customerId);
        if (cartAfterFail.items.length !== 1 || cartAfterFail.items[0].quantity !== 2) {
            throw new Error("Cart items were modified after checkout failed");
        }
        console.log("Test 4 Passed.");


        console.log("\n--- Test 5: Price changed after adding to cart is refreshed ---");
        await resetState(1000);
        
        // Add item to cart (price is initially 350, so cart total is 350)
        await CartService.addItem(customerId, largeVariant._id.toString(), 1);
        
        // Update catalog price of variant to 399
        largeVariant.price = 399;
        await largeVariant.save();

        const { order: orderRefreshed } = await CheckoutService.checkout(customerId);
        console.log(`Checkout price: ${orderRefreshed.grandTotal} (Expected: 399)`);
        
        if (orderRefreshed.grandTotal !== 399) {
            throw new Error(`Expected GrandTotal 399 based on refreshed catalog price, got ${orderRefreshed.grandTotal}`);
        }
        console.log("Test 5 Passed.");


        console.log("\n--- Test 6: Transaction Rollback (Exception after stock deduction, before order creation) ---");
        await resetState(1000);
        
        // Add Qty 2 (needs 200g cheese)
        await CartService.addItem(customerId, largeVariant._id.toString(), 2);

        // Stub OrderService.createOrder to force throw an error during order generation
        const originalCreateOrder = (OrderService as any).createOrder;
        (OrderService as any).createOrder = async () => {
            throw new Error("Simulated Order Creation Failure");
        };

        try {
            await CheckoutService.checkout(customerId);
            throw new Error("Expected checkout transaction to fail and abort");
        } catch (err: any) {
            console.log(`Test 6 transaction successfully aborted with: "${err.message}"`);
        } finally {
            // Restore original createOrder method
            (OrderService as any).createOrder = originalCreateOrder;
        }

        // 1. Confirm no order got created
        const orderCount = await Order.countDocuments({ customer: customerId });
        if (orderCount !== 0) throw new Error("An order was saved in DB despite transaction abort");

        // 2. Confirm no stock was deducted from inventory
        const finalInventory = await Inventory.findById(inventory._id);
        console.log(`Pre-test Stock: 1000g, Post-abort Stock: ${finalInventory?.currentStock}g`);
        if (finalInventory?.currentStock !== 1000) {
            throw new Error(`Stock was deducted despite transaction abort: currentStock=${finalInventory?.currentStock}g`);
        }

        // 3. Confirm no inventory transactions were saved
        const finalTxCount = await InventoryTransaction.countDocuments({ inventory: inventory._id });
        if (finalTxCount !== 0) throw new Error("Inventory transactions were created despite transaction abort");

        // 4. Confirm cart remains completely unchanged (not cleared)
        const finalCart = await CartService.getCart(customerId);
        if (finalCart.items.length !== 1 || finalCart.items[0].quantity !== 2) {
            throw new Error("Cart was cleared/altered despite transaction abort");
        }

        console.log("Test 6 Passed. Rollback worked perfectly!");

        console.log("\n🎉 ALL CHECKOUT SCENARIOS PASSED SUCCESSFULLY!");

    } catch (e) {
        console.error("\n❌ Test Suite Failed with error:", e);
        process.exitCode = 1;
    } finally {
        console.log("Cleaning up test database records...");
        await resetState();
        await User.deleteMany({ email: testEmail });
        await Food.deleteMany({ name: "Checkout Pizza" });
        await FoodVariant.deleteMany({ name: { $in: ["Large Pizza", "Medium Pizza"] } });
        await Ingredient.deleteMany({ name: "Checkout Cheese" });
        await Recipe.deleteMany({});
        await mongoose.disconnect();
        console.log("Disconnected from database.");
    }
}

runTests();
