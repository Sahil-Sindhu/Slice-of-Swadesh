import { EmailProvider, SendEmailOptions } from "./EmailProvider";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

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
      console.error("Template compilation failed:", e);
    }

    console.log(`\n================== MOCK EMAIL ==================`);
    console.log(`To:      ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Tpl:     ${options.template}`);
    if (html) {
      console.log(`Body (HTML length): ${html.length} chars (rendered)`);
    } else {
      console.log(`Context: ${JSON.stringify(options.context, null, 2)}`);
    }
    console.log(`================================================\n`);
  }
}
