import { Router } from "express";
import { downloadInvoice, emailInvoice } from "../controllers/invoice.controller";
import { authenticate, requireRoles } from "../../../middleware/auth";

const router = Router();

// Customer can download their own invoice (ideally we should check ownership in controller)
router.get("/:orderId/download", authenticate, downloadInvoice);

// Admin can trigger email
router.post("/:orderId/send", authenticate, requireRoles(["admin", "manager"]), emailInvoice);

export default router;
