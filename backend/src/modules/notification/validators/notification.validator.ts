import { z } from "zod";

export const MarkAsReadSchema = z.object({
  id: z.string().min(1, "Notification ID is required"),
});
