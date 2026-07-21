import { Router } from "express";
import {
    createRecipe,
    getRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    restoreRecipe
} from "../controllers/recipeController";
import {
    authenticate,
    requireRoles
} from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
    createRecipeSchema,
    updateRecipeSchema
} from "../dto/recipe.dto";

const router = Router();

// Public routes
router.get("/", getRecipes);
router.get("/:id", getRecipeById);

// Protected routes (Admin, Manager, Superadmin)
router.post(
    "/",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(createRecipeSchema),
    createRecipe
);

router.put(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(updateRecipeSchema),
    updateRecipe
);

router.delete(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    deleteRecipe
);

router.patch(
    "/:id/restore",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    restoreRecipe
);

export default router;
