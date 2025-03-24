import { Body, Controller, Param, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JWTService } from '../services/jwt.service';

// import DTO
import { AdminLoginDto, LoginDto } from '../dto/Login.dto';
import { OtpDto } from '../dto/otp.dto';
import { adminRegisterDto, registerDto } from '../dto/register.dto';
import { sendForgotPasswordEmailDto } from '../dto/sendForgotPassword.dot';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JWTService,
  ) {}

  @Post('login')
  async login(@Body(new ValidationPipe({ whitelist: true })) body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('sign-up')
  async signUp(
    @Body(new ValidationPipe({ whitelist: true })) body: registerDto,
  ) {
    return this.authService.signUp(body);
  }

  @Post('verification')
  async OtpVerification(
    @Body(new ValidationPipe({ whitelist: true })) OtpDto: OtpDto,
  ) {
    return this.authService.userOTPRequest(OtpDto.email);
  }

  @Post('forgot-password')
  async sendForgotPasswordEmail(
    @Body(new ValidationPipe({ whitelist: true }))
    body: sendForgotPasswordEmailDto,
  ) {
    return this.authService.sendForgotPasswordEmail(body.email);
  }

  @Post('forgot-password/change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ) {
    return this.authService.changePassword(id, body.newPassword);
  }

  @Post('admin/sign-up')
  async createRootUsers(@Body() body: adminRegisterDto) {
    return this.authService.adminSignUp(body);
  }

  @Post('admin/login')
  async LoginRootUsers(@Body() body: AdminLoginDto) {
    return this.authService.AdminLogin(body.email, body.password);
  }

  @Post('admin/forgot-password/change-password/:id')
  async adminChangePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ) {
    return this.authService.adminChangePassword(id, body.newPassword);
  }

  @Post('refresh-token')
  async getNewToken(@Body() body: { refresh_token: string }) {
    return this.jwtService.refreshToken(body.refresh_token);
  }
}
