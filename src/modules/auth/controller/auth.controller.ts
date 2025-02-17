import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

// import DTO
import { LoginDto } from '../dto/Login.dto';
import { OtpDto } from '../dto/otp.dto';
import { registerDto } from '../dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(new ValidationPipe({ whitelist: true })) body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('sign-up')
  async signUp(
    @Body(new ValidationPipe({ whitelist: true })) body: registerDto,
  ) {
    return this.authService.signUp(body, body.otp);
  }

  @Post('verification')
  async OtpVerification(
    @Body(new ValidationPipe({ whitelist: true })) OtpDto: OtpDto,
  ) {
    return this.authService.userOTPRequest(OtpDto.email);
  }
}
