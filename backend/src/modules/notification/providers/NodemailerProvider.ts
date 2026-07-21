import { EmailProvider, SendEmailOptions } from "./EmailProvider";

export class NodemailerProvider implements EmailProvider {
  async sendEmail(options: SendEmailOptions): Promise<void> {
    // This is a placeholder for Sprint B2.
    // When configuring email, we would initialize nodemailer here and compile handlebars templates.
    throw new Error("NodemailerProvider is not implemented yet. Set NOTIFICATION_EMAIL_PROVIDER=mock in env.");
  }
}
