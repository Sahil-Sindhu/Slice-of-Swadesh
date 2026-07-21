import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getCategoryTree,
  getCategoryAnalytics,
} from "../controllers/categoryController";

import { authenticate, requireRoles } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../dto/category.dto";

const router = Router();

// Public Routes
router.get("/tree", getCategoryTree);
router.get(
  "/analytics",
  authenticate,
  requireRoles(["admin", "manager", "superadmin"]),
  getCategoryAnalytics
);
router.get("/", getCategories);
router.get("/:id", getCategory);

// Admin/Manager Routes
router.post(
  "/",
  authenticate,
  requireRoles(["admin", "manager", "superadmin"]),
  validateBody(createCategorySchema),
  createCategory
);

router.put(
  "/:id",
  authenticate,
  requireRoles(["admin", "manager", "superadmin"]),
  updateCategory
);

router.delete(
  "/:id",
  authenticate,
  requireRoles(["admin", "manager", "superadmin"]),
  deleteCategory
);

router.patch(
  "/:id/restore",
  authenticate,
  requireRoles(["admin", "manager", "superadmin"]),
  restoreCategory
);

export default router;
