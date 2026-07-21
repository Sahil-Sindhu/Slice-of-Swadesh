import { InvoiceGenerator, InvoiceGeneratorContext } from "./InvoiceGenerator";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer";

export class HtmlPdfGenerator implements InvoiceGenerator {
  async generate(context: InvoiceGeneratorContext): Promise<Buffer> {
    const templateName = `invoice-${context.templateVersion}.hbs`;
    const templatePath = path.join(__dirname, "../templates", templateName);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Invoice template ${templateName} not found at ${templatePath}`);
    }

    const templateStr = fs.readFileSync(templatePath, "utf-8");
    const compiled = handlebars.compile(templateStr);
    
    // Register helpers if needed (e.g., currency formatter)
    handlebars.registerHelper('formatCurrency', function(value: number) {
        return `₹${value.toFixed(2)}`;
    });

    const html = compiled(context);

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // We set the content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  }
}
