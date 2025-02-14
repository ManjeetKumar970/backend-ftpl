import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpVerificationDocument = OtpVerification & Document;

@Schema({ timestamps: true }) // Enables createdAt field automatically
export class OtpVerification {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now, expires: 300 }) // Auto-delete after 60 seconds
  createdAt: Date;
}

export const OtpVerificationSchema =
  SchemaFactory.createForClass(OtpVerification);
