import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ValidationPipe({ whitelist: true })) loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('sign-up')
  async signUp(
    @Body(new ValidationPipe({ whitelist: true })) loginDto: LoginDto,
  ) {
    return this.authService.signUp(loginDto.email, loginDto.password);
  }
}
