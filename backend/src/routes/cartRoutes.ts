import { Router } from "express";
import { getCart, addItem, updateItem, removeItem, clearCart } from "../controllers/cartController";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { addToCartSchema, updateCartItemSchema } from "../dto/cart.dto";

const router = Router();

// Secure all cart endpoints with authentication
router.use(authenticate);

router.get("/", getCart);
router.post("/add", validateBody(addToCartSchema), addItem);
router.patch("/item/:itemId", validateBody(updateCartItemSchema), updateItem);
router.delete("/item/:itemId", removeItem);
router.delete("/clear", clearCart);

export default router;
