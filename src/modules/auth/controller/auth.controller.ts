import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signUp.dto';
import { OtpDto } from '../dto/otp.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(new ValidationPipe({ whitelist: true })) body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('sign-up')
  async signUp(@Body(new ValidationPipe({ whitelist: true })) body: SignUpDto) {
    return this.authService.signUp(body, body.otp);
  }

  @Post('verification')
  async OtpVerification(
    @Body(new ValidationPipe({ whitelist: true })) OtpDto: OtpDto,
  ) {
    return this.authService.userOTPRequest(OtpDto.email);
  }
}
