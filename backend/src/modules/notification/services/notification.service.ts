import { Notification } from "../models/Notification";
import { NotificationType, NotificationChannel } from "../constants/notification";
import { EmailProvider } from "../providers/EmailProvider";
import { MockEmailProvider } from "../providers/MockEmailProvider";
import { NodemailerProvider } from "../providers/NodemailerProvider";
import { User } from "../../../models/User";
import { NotFoundError } from "../../../errors/NotFoundError";
import mongoose from "mongoose";

interface SendNotificationArgs {
  userId?: string;
  type: NotificationType;
  channels: NotificationChannel[];
  title: string;
  message: string;
  metadata?: any;
  emailTemplate?: string;
}

export class NotificationService {
  private static getEmailProvider(): EmailProvider {
    const providerType = process.env.NOTIFICATION_EMAIL_PROVIDER || "mock";
    if (providerType.toLowerCase() === "nodemailer") {
      return new NodemailerProvider();
    }
    return new MockEmailProvider();
  }

  static async send(args: SendNotificationArgs, session?: mongoose.ClientSession): Promise<void> {
    const { userId, type, channels, title, message, metadata, emailTemplate } = args;

    // 1. Create IN_APP notification if requested
    if (channels.includes(NotificationChannel.IN_APP)) {
      const payload = {
        userId,
        type,
        channel: NotificationChannel.IN_APP,
        title,
        message,
        metadata,
        status: "SENT",
        read: false
      };
      
      if (session) {
        await Notification.create([payload], { session });
      } else {
        await Notification.create(payload);
      }
    }

    // 2. Send EMAIL if requested
    if (channels.includes(NotificationChannel.EMAIL)) {
      let recipientEmail = "";

      // Try to get user email if userId is provided
      if (userId) {
        let user;
        if (session) {
          user = await User.findById(userId).session(session);
        } else {
          user = await User.findById(userId);
        }
        
        if (user) {
          recipientEmail = user.email;
        }
      } else {
        // Fallback for system alerts
        recipientEmail = process.env.ADMIN_EMAIL || "admin@sliceofswadesh.com";
      }

      if (recipientEmail && emailTemplate) {
        const emailProvider = this.getEmailProvider();
        try {
          await emailProvider.sendEmail({
            to: recipientEmail,
            subject: title,
            template: emailTemplate,
            context: {
              title,
              message,
              ...metadata
            }
          });
        } catch (error) {
          console.error(`Failed to send email to ${recipientEmail}:`, error);
          // We don't throw here to avoid failing the main transaction (e.g. order placement)
          // just because an email failed to send. In a real app, this goes to a queue.
        }
      }
    }
  }

  static async getUserNotifications(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      Notification.find({ userId, channel: NotificationChannel.IN_APP })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId, channel: NotificationChannel.IN_APP })
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({ userId, channel: NotificationChannel.IN_APP, read: false });
  }

  static async markAsRead(notificationId: string, userId: string, isAdmin = false) {
    const query: any = { _id: notificationId };
    if (!isAdmin) {
      query.userId = userId;
    } else {
      query.$or = [{ userId }, { userId: { $exists: false } }];
    }

    const notification = await Notification.findOne(query);
    if (!notification) throw new NotFoundError("Notification not found");
    
    notification.read = true;
    await notification.save();
    return notification.toJSON();
  }

  static async markAllAsRead(userId: string, isAdmin = false) {
    const query: any = { read: false };
    if (!isAdmin) {
      query.userId = userId;
    } else {
      query.$or = [{ userId }, { userId: { $exists: false } }];
    }
    await Notification.updateMany(query, { $set: { read: true } });
  }

  static async getAdminNotifications(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    // System alerts don't have a specific user
    const [notifications, total] = await Promise.all([
      Notification.find({ userId: { $exists: false }, channel: NotificationChannel.IN_APP })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId: { $exists: false }, channel: NotificationChannel.IN_APP })
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}
