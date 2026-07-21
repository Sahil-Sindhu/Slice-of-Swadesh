import { Router } from "express";
import { createFood, getFoods, getFoodById, getFoodBySlug, updateFood, deleteFood, restoreFood } from "../controllers/foodController";
import { authenticate, requireRoles } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createFoodSchema, updateFoodSchema } from "../dto/food.dto";

const router = Router();

router.get("/", getFoods);

// Slug route MUST come before /:id — otherwise "slug" is treated as a Mongo ID
router.get("/slug/:slug", getFoodBySlug);

router.get("/:id", getFoodById);


router.post(
    "/",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(createFoodSchema),
    createFood
);

router.put(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    validateBody(updateFoodSchema),
    updateFood
);

router.delete(
    "/:id",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    deleteFood
);

router.patch(
    "/:id/restore",
    authenticate,
    requireRoles(["admin", "manager", "superadmin"]),
    restoreFood
);

export default router;
