import { Router } from "express";
import { checkout } from "../controllers/checkoutController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/checkout", authenticate, checkout);

export default router;
