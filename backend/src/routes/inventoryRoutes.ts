import { Router } from "express";
import {
    createInventory,
    getInventories,
    getInventoryById,
    updateInventory,
    deleteInventory,
    restoreInventory
} from "../controllers/inventoryController";
import {
    authenticate,
    requireRoles
} from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
    createInventorySchema,
    updateInventorySchema
} from "../dto/inventory.dto";

const router = Router();

// Public routes
router.get("/", getInventories);
router.get("/:id", getInventoryById);

// Protected routes
router.post(
    "/",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(createInventorySchema),
    createInventory
);

router.put(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(updateInventorySchema),
    updateInventory
);

router.delete(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    deleteInventory
);

router.patch(
    "/:id/restore",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    restoreInventory
);

export default router;
