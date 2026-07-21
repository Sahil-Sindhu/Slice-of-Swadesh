import { NotificationType, NotificationChannel } from "../constants/notification";

export interface INotification {
  _id?: string;
  userId?: string; // Optional for admin/system alerts
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  status: "PENDING" | "SENT" | "FAILED";
  read: boolean;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
