import { Router } from "express";
import {
    createVariant,
    getVariants,
    getVariantById,
    updateVariant,
    deleteVariant,
    restoreVariant
} from "../controllers/variantController";
import {
    authenticate,
    requireRoles
} from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
    createVariantSchema,
    updateVariantSchema
} from "../dto/variant.dto";

const router = Router();

// Public routes
router.get("/", getVariants);
router.get("/:id", getVariantById);

// Protected routes
router.post(
    "/",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(createVariantSchema),
    createVariant
);

router.put(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(updateVariantSchema),
    updateVariant
);

router.delete(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    deleteVariant
);

router.patch(
    "/:id/restore",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    restoreVariant
);

export default router;
