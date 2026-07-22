import { EmailProvider, SendEmailOptions } from "./EmailProvider";
import * as nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { logger } from "../../../utils/logger";

export class NodemailerProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log({
      provider: process.env.NOTIFICATION_EMAIL_PROVIDER,
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      user: process.env.NODEMAILER_USER,
    });
    this.transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST || "smtp.gmail.com",
      port: parseInt(process.env.NODEMAILER_PORT || "587"),
      secure: process.env.NODEMAILER_PORT === "465",
      auth: {
        user: process.env.NODEMAILER_USER || "",
        pass: process.env.NODEMAILER_PASS || "",
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    let html = "";
    try {
      const templatePath = path.join(__dirname, "../templates", `${options.template}.hbs`);
      if (fs.existsSync(templatePath)) {
        const templateStr = fs.readFileSync(templatePath, "utf-8");
        const compiled = handlebars.compile(templateStr);
        html = compiled({
          ...options.context,
          year: new Date().getFullYear(),
          frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000"
        });
      } else {
        html = `<p>${options.subject}</p><p>Template ${options.template} not found.</p>`;
      }
    } catch (e) {
      logger.error("Template compilation failed in NodemailerProvider", {
        service: 'email',
        error: e instanceof Error ? e.message : String(e)
      });
      html = `<p>${options.subject}</p>`;
    }

    try {
      const mailOptions = {
        from: `"Slice of Swadesh" <${process.env.NODEMAILER_USER || "no-reply@swadeshslice.com"}>`,
        to: options.to,
        subject: options.subject,
        html: html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Real email dispatched via Nodemailer", {
        service: 'email',
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });
    } catch (error) {
      logger.error("Failed to send email via Nodemailer", {
        service: 'email',
        error: error instanceof Error ? error.message : String(error),
        to: options.to,
      });
      throw error;
    }
  }
}
