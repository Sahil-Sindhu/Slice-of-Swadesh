import { EmailProvider, SendEmailOptions } from "./EmailProvider";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { logger } from "../../../utils/logger";

export class MockEmailProvider implements EmailProvider {
  async sendEmail(options: SendEmailOptions): Promise<void> {
    let html = "";
    try {
      const templatePath = path.join(__dirname, "../templates", `${options.template}.hbs`);
      if (fs.existsSync(templatePath)) {
        const templateStr = fs.readFileSync(templatePath, "utf-8");
        const compiled = handlebars.compile(templateStr);
        html = compiled({ ...options.context, year: new Date().getFullYear(), frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000" });
      }
    } catch (e) {
      logger.error("Template compilation failed", { service: 'email', error: e instanceof Error ? e.message : String(e) });
    }

    logger.info("Mock email dispatched", {
      service: 'email',
      to: options.to,
      subject: options.subject,
      template: options.template,
      bodyLength: html ? html.length : undefined,
      context: html ? undefined : options.context
    });
  }
}
