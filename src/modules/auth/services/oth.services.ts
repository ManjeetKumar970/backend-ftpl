// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpMailService {
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
  async sendEmail(to: string, subject: string, otp: string) {
    const mailOptions = {
      from: 'admin@ftpl.com', // Sender address
      to: to, // Recipient address
      subject: subject, // Subject line
      text: `Your FTPL one-time password (OTP) is ${otp}. Please use this OTP to complete your verification. Do not share this code with anyone. It will expire in 2 minutes.`, // Plain text body
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
