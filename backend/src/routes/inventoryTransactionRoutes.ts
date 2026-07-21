import { Router } from "express";
import {
    addStock,
    removeStock,
    adjustStock,
    getInventoryHistory
} from "../controllers/inventoryTransactionController";
import {
    authenticate,
    requireRoles
} from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
    stockTransactionSchema,
    adjustStockSchema
} from "../dto/inventoryTransaction.dto";

const router = Router();

// Protected transaction operations
router.post(
    "/inventory/add-stock",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(stockTransactionSchema),
    addStock
);

router.post(
    "/inventory/remove-stock",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(stockTransactionSchema),
    removeStock
);

router.post(
    "/inventory/adjust-stock",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(adjustStockSchema),
    adjustStock
);

// Public history retrieval endpoint
router.get(
    "/inventory/history/:inventoryId",
    getInventoryHistory
);

export default router;
