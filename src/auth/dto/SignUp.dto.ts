import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @MinLength(6, { message: 'OTP must be 6 Digit' })
  @MaxLength(6, { message: 'OTP must be 6 Digit' })
  otp: string;
}
