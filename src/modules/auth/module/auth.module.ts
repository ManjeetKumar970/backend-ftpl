import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { MailService } from 'src/common/services/mail.services';

import * as dotenv from 'dotenv';
import { JwtAdminAuthGuard } from 'src/common/guard/jwt-admin-auth.guard';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, MailService, JwtAdminAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAdminAuthGuard],
})
export class AuthModule {}
