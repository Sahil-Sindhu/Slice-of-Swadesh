export interface SendEmailOptions {
  to: string;
  subject: string;
  template: string; // The name of the Handlebars template
  context?: any;    // Variables for the template
}

export interface EmailProvider {
  /**
   * Sends an email using the underlying provider.
   */
  sendEmail(options: SendEmailOptions): Promise<void>;
}
