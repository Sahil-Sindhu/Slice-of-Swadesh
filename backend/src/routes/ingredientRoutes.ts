import { Router } from "express";
import {
    createIngredient,
    getIngredients,
    getIngredientById,
    updateIngredient,
    deleteIngredient,
    restoreIngredient
} from "../controllers/ingredientController";
import {
    authenticate,
    requireRoles
} from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
    createIngredientSchema,
    updateIngredientSchema
} from "../dto/ingredient.dto";

const router = Router();

// Public routes
router.get("/", getIngredients);
router.get("/:id", getIngredientById);

// Protected routes
router.post(
    "/",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(createIngredientSchema),
    createIngredient
);

router.put(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(updateIngredientSchema),
    updateIngredient
);

router.delete(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    deleteIngredient
);

router.patch(
    "/:id/restore",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    restoreIngredient
);

export default router;
