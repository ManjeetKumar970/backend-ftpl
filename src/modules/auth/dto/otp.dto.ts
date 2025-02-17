import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
