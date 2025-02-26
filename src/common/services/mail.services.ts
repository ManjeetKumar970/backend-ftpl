// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Create a transporter using your email service provider's SMTP settings
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use the desired email service (e.g., 'gmail', 'yahoo', etc.)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or App Password if 2FA is enabled
      },
    });
  }

  // Reusable method to send an email
  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string, // Allow HTML content
  ): Promise<nodemailer.SentMessageInfo> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"FTPL Admin"`,
      to,
      subject,
      text, // Plain text fallback
      html, // Ensure HTML is used for formatting
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      throw new Error('Failed to send email. Please try again.');
    }
  }
}
