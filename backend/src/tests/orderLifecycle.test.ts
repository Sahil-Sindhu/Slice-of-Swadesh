import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../models/User";
import { Food } from "../models/Food";
import { FoodVariant } from "../models/FoodVariant";
import { Order } from "../models/Order";
import { OrderTimeline } from "../models/OrderTimeline";
import { OrderService } from "../services/orderService";
import { StockDeductionService } from "../services/stockDeductionService";
import { updateOrderStatus, getKitchenQueue } from "../controllers/orderController";

// Mock StockDeductionService to prevent needing recipes & inventory database setups
StockDeductionService.deductStockForVariant = async () => {
    return { success: true, message: "Stock deducted successfully" };
};

const makeMockRes = () => {
    const res: any = {};
    res.status = (code: number) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data: any) => {
        res.body = data;
        return res;
    };
    return res;
};

async function runTests() {
    console.log("Connecting to database...");
    const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/slice-of-swadesh";
    await mongoose.connect(connString);
    console.log("Connected to MongoDB.");

    // Cleanup existing test records if any
    const testEmail = "testchef@sliceofswadesh.com";
    await User.deleteMany({ email: testEmail });
    await Food.deleteMany({ name: "Test Pizza" });
    await FoodVariant.deleteMany({ name: "Test Large Variant" });

    // Setup basic master data
    const user = await User.create({
        email: testEmail,
        name: "Test Chef",
        role: "chef"
    });

    const categoryId = new mongoose.Types.ObjectId();
    const food = await Food.create({
        name: "Test Pizza",
        slug: "test-pizza",
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

    const foodVariant = await FoodVariant.create({
        food: food._id,
        name: "Test Large Variant",
        price: 350,
        preparationTime: 15,
        isAvailable: true,
        isDeleted: false
    });

    const cleanUpOrders = async () => {
        await Order.deleteMany({ createdBy: user._id });
        await OrderTimeline.deleteMany({ updatedBy: user._id });
    };

    try {
        console.log("\n--- Starting Scenario 1: Pending -> Confirmed (PASS) ---");
        const order1 = await OrderService.placeOrder({
            customer: user._id.toString(),
            items: [{ foodVariant: foodVariant._id.toString(), quantity: 1 }],
            createdBy: user._id.toString()
        });
        console.log(`Placed initial order (Pending) with ID: ${order1._id}`);

        const updatedOrder1 = await OrderService.updateStatus({
            orderId: order1._id.toString(),
            status: "Confirmed",
            remarks: "Manager confirmed order",
            updatedBy: user._id.toString()
        });

        if (updatedOrder1.status !== "Confirmed") {
            throw new Error(`Expected Confirmed status but got ${updatedOrder1.status}`);
        }
        console.log("Scenario 1 Passed.");


        console.log("\n--- Starting Scenario 2: Pending -> Preparing (FAIL) ---");
        const order2 = await OrderService.placeOrder({
            customer: user._id.toString(),
            items: [{ foodVariant: foodVariant._id.toString(), quantity: 1 }],
            createdBy: user._id.toString()
        });

        try {
            await OrderService.updateStatus({
                orderId: order2._id.toString(),
                status: "Preparing",
                remarks: "Try directly cooking",
                updatedBy: user._id.toString()
            });
            throw new Error("Expected updateStatus to fail when transitioning from Pending directly to Preparing.");
        } catch (err: any) {
            console.log(`Scenario 2 successfully failed as expected with message: "${err.message}"`);
        }


        console.log("\n--- Starting Scenario 3: Preparing -> Ready (PASS) ---");
        // Start from Pending -> Confirmed -> Preparing -> Ready
        const order3 = await OrderService.placeOrder({
            customer: user._id.toString(),
            items: [{ foodVariant: foodVariant._id.toString(), quantity: 1 }],
            createdBy: user._id.toString()
        });

        await OrderService.updateStatus({
            orderId: order3._id.toString(),
            status: "Confirmed",
            remarks: "Conf",
            updatedBy: user._id.toString()
        });

        await OrderService.updateStatus({
            orderId: order3._id.toString(),
            status: "Preparing",
            remarks: "Chef started",
            updatedBy: user._id.toString()
        });

        const readyOrder = await OrderService.updateStatus({
            orderId: order3._id.toString(),
            status: "Ready",
            remarks: "Ready to serve",
            updatedBy: user._id.toString()
        });

        if (readyOrder.status !== "Ready") {
            throw new Error(`Expected status Ready, but got ${readyOrder.status}`);
        }
        if (!readyOrder.timers.startedPreparingAt || !readyOrder.timers.readyAt) {
            throw new Error("Timers (startedPreparingAt or readyAt) were not populated correctly.");
        }
        console.log("Scenario 3 Passed. Timers were set correctly.");


        console.log("\n--- Starting Scenario 4: Completed -> Preparing (FAIL) ---");
        // Transition order3 from Ready -> Completed
        await OrderService.updateStatus({
            orderId: order3._id.toString(),
            status: "Completed",
            remarks: "Delivered to customer",
            updatedBy: user._id.toString()
        });

        try {
            await OrderService.updateStatus({
                orderId: order3._id.toString(),
                status: "Preparing",
                remarks: "Try re-opening Completed order",
                updatedBy: user._id.toString()
            });
            throw new Error("Expected updateStatus to fail when transitioning from Completed status.");
        } catch (err: any) {
            console.log(`Scenario 4 successfully failed as expected with message: "${err.message}"`);
        }


        console.log("\n--- Starting Scenario 5: Kitchen Queue ---");
        // Clear all previous orders for precise queue matching
        await cleanUpOrders();

        // Create Order A (will be Confirmed)
        const orderA = await OrderService.placeOrder({
            customer: user._id.toString(),
            items: [{ foodVariant: foodVariant._id.toString(), quantity: 1 }],
            createdBy: user._id.toString()
        });
        await OrderService.updateStatus({
            orderId: orderA._id.toString(),
            status: "Confirmed",
            remarks: "Confirm Order A",
            updatedBy: user._id.toString()
        });

        // Delay slightly to ensure distinct timestamps for sorting verification
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create Order B (will be Preparing)
        const orderB = await OrderService.placeOrder({
            customer: user._id.toString(),
            items: [{ foodVariant: foodVariant._id.toString(), quantity: 1 }],
            createdBy: user._id.toString()
        });
        await OrderService.updateStatus({
            orderId: orderB._id.toString(),
            status: "Confirmed",
            remarks: "Confirm Order B",
            updatedBy: user._id.toString()
        });
        await OrderService.updateStatus({
            orderId: orderB._id.toString(),
            status: "Preparing",
            remarks: "Cook Order B",
            updatedBy: user._id.toString()
        });

        // Create Order C (will be Completed, so it should not appear in queue)
        const orderC = await OrderService.placeOrder({
            customer: user._id.toString(),
            items: [{ foodVariant: foodVariant._id.toString(), quantity: 1 }],
            createdBy: user._id.toString()
        });
        await OrderService.updateStatus({
            orderId: orderC._id.toString(),
            status: "Confirmed",
            remarks: "Confirm Order C",
            updatedBy: user._id.toString()
        });
        await OrderService.updateStatus({
            orderId: orderC._id.toString(),
            status: "Preparing",
            remarks: "Cook Order C",
            updatedBy: user._id.toString()
        });
        await OrderService.updateStatus({
            orderId: orderC._id.toString(),
            status: "Ready",
            remarks: "Ready Order C",
            updatedBy: user._id.toString()
        });
        await OrderService.updateStatus({
            orderId: orderC._id.toString(),
            status: "Completed",
            remarks: "Complete Order C",
            updatedBy: user._id.toString()
        });

        // Test the getKitchenQueue controller directly using mock Express request and response
        const mockReq: any = { user };
        const mockRes = makeMockRes();

        await getKitchenQueue(mockReq, mockRes);

        const ordersInQueue = mockRes.body.data.orders;
        console.log(`Kitchen Queue returned ${ordersInQueue.length} order(s).`);

        if (ordersInQueue.length !== 2) {
            throw new Error(`Expected exactly 2 orders in queue, but got ${ordersInQueue.length}`);
        }

        const ids = ordersInQueue.map((o: any) => o._id.toString());
        if (!ids.includes(orderA._id.toString()) || !ids.includes(orderB._id.toString())) {
            throw new Error("Kitchen queue did not contain correct orders (Order A and Order B).");
        }

        if (ids.includes(orderC._id.toString())) {
            throw new Error("Kitchen queue contained a Completed order (Order C) which is invalid.");
        }

        // Check ascending creation order sorting (Order A first, Order B second)
        if (ids[0] !== orderA._id.toString() || ids[1] !== orderB._id.toString()) {
            throw new Error("Kitchen queue was not sorted correctly by createdAt in ascending order.");
        }

        console.log("Scenario 5 Passed.");

        console.log("\n--- Checking Timeline Entries ---");
        const timelineEntries = await OrderTimeline.find({ order: orderB._id }).sort({ createdAt: 1 });
        console.log(`Timeline entries found for Order B: ${timelineEntries.length}`);
        
        // Timeline should have:
        // 1. null -> Pending
        // 2. Pending -> Confirmed
        // 3. Confirmed -> Preparing
        if (timelineEntries.length !== 3) {
            throw new Error(`Expected exactly 3 timeline entries, but got ${timelineEntries.length}`);
        }
        if (timelineEntries[0].oldStatus !== null || timelineEntries[0].newStatus !== "Pending") {
            throw new Error("First timeline entry is incorrect");
        }
        if (timelineEntries[1].oldStatus !== "Pending" || timelineEntries[1].newStatus !== "Confirmed") {
            throw new Error("Second timeline entry is incorrect");
        }
        if (timelineEntries[2].oldStatus !== "Confirmed" || timelineEntries[2].newStatus !== "Preparing") {
            throw new Error("Third timeline entry is incorrect");
        }
        console.log("Timeline check Passed.");

        console.log("\n🎉 ALL SCENARIOS PASSED SUCCESSFULLY!");

    } catch (e) {
        console.error("\n❌ Test Suite Failed with error:", e);
        process.exitCode = 1;
    } finally {
        console.log("Cleaning up database test records...");
        await cleanUpOrders();
        await User.deleteMany({ email: testEmail });
        await Food.deleteMany({ name: "Test Pizza" });
        await FoodVariant.deleteMany({ name: "Test Large Variant" });
        await mongoose.disconnect();
        console.log("Disconnected from database. Test complete.");
    }
}

runTests();
