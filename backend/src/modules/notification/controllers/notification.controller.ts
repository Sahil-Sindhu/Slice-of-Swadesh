import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { AuthRequest } from "../../../middleware/auth";
import { sendSuccess } from "../../../utils/response";
import { handleError } from "../../../utils/errorHandler";
import { UnauthorizedError } from "../../../errors/UnauthorizedError";

export class NotificationController {
  
  static async getUserNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) throw new UnauthorizedError("Not authenticated");
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await NotificationService.getUserNotifications(userId, page, limit);
      return sendSuccess(res, "Notifications retrieved successfully", result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) throw new UnauthorizedError("Not authenticated");
      
      const count = await NotificationService.getUnreadCount(userId);
      return sendSuccess(res, "Unread count retrieved", { count });
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      const role = req.user?.role;
      if (!userId) throw new UnauthorizedError("Not authenticated");
      
      const { id } = req.params;
      const notification = await NotificationService.markAsRead(id, userId, role === 'admin');
      return sendSuccess(res, "Notification marked as read", notification);
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      const role = req.user?.role;
      if (!userId) throw new UnauthorizedError("Not authenticated");
      
      await NotificationService.markAllAsRead(userId, role === 'admin');
      return sendSuccess(res, "All notifications marked as read", {});
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async getAdminNotifications(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await NotificationService.getAdminNotifications(page, limit);
      return sendSuccess(res, "Admin notifications retrieved successfully", result);
    } catch (error) {
      return handleError(res, error);
    }
  }
}
