import { IsEmail } from 'class-validator';

export class sendForgotPasswordEmailDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
