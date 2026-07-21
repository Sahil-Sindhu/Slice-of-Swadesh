import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authenticate } from "../../../middleware/auth";
import { validateBody } from "../../../middleware/validate";
import { MarkAsReadSchema } from "../validators/notification.validator";

const router = Router();

// Get user notifications
router.get("/", authenticate, NotificationController.getUserNotifications);

// Get unread count
router.get("/unread", authenticate, NotificationController.getUnreadCount);

// Admin notifications
router.get("/admin", authenticate, NotificationController.getAdminNotifications);

// Mark all as read
router.patch("/read-all", authenticate, NotificationController.markAllAsRead);

// Mark as read
router.patch("/:id/read", authenticate, NotificationController.markAsRead);

export default router;
