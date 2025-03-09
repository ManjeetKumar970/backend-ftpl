import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcryptjs';

// Utils
import { encryptedOTP } from '../../../utils/Otp';
import { MailService } from 'src/common/services/mail.services';
import { registerDto } from '../dto/register.dto';
import {
  generateForgotPasswordEmail,
  generateOtpEmail,
} from '../../../utils/emailMessageText';

@Injectable()
export class AuthService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: registerDto): Promise<{ access_token: string }> {
    const existingUser = await this.entityManager.query(
      `SELECT * FROM "user" WHERE "email" = $1 OR "phoneNumber" = $2 LIMIT 1`,
      [body.email, body.phoneNumber],
    );

    if (existingUser.length > 0) {
      throw new ConflictException('Email/phone already registered.');
    }

    const [otpRecord] = await this.entityManager.query(
      `SELECT * FROM "otp_verifications" WHERE "email" = $1 LIMIT 1`,
      [body.email],
    );

    if (!otpRecord.otp || otpRecord.otp != body.otp) {
      throw new ConflictException('Invalid or expired OTP.');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await this.entityManager.query(
      `INSERT INTO "user" ("email", "password", "name", "phoneNumber") VALUES ($1, $2, $3, $4)`,
      [body.email, hashedPassword, body.name, body.phoneNumber],
    );

    await this.entityManager.query(
      `DELETE FROM "otp_verifications" WHERE email = $1`,
      [body.email],
    );

    const payload = { email: body.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.entityManager.query(
      `SELECT * FROM "user" WHERE email = $1 LIMIT 1`,
      [email],
    );
    if (!user.length || !(await bcrypt.compare(password, user[0].password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      access_token: this.jwtService.sign({
        email: user[0].email,
        id: user[0].id,
      }),
    };
  }

  async userOTPRequest(email: string): Promise<{ otp_token: string }> {
    const [isUserExist] = await this.entityManager.query(
      'SELECT * FROM "user" WHERE "email" = $1',
      [email],
    );

    if (!isUserExist) {
      throw new UnauthorizedException('Email already registered.');
    }

    const generatedOtp = encryptedOTP();
    await this.mailService.sendEmail(
      email,
      'FTPL Account Verification - OTP Code',
      'Use the OTP below to verify your account.',
      generateOtpEmail(generatedOtp.otp),
    );

    await this.entityManager.query(
      `INSERT INTO "otp_verifications" ("email", "otp") VALUES ($1, $2) 
       ON CONFLICT ("email") DO UPDATE SET otp = EXCLUDED.otp`,
      [email, generatedOtp.otp],
    );
    return { otp_token: generatedOtp.encryptedOTP };
  }

  async sendForgotPasswordEmail(email: string): Promise<void> {
    const user = await this.entityManager.query(
      `SELECT * FROM "user" WHERE "email" = $1 LIMIT 1`,
      [email],
    );
    if (!user.length) {
      throw new UnauthorizedException('Email does not exist.');
    }
    await this.mailService.sendEmail(
      email,
      'Password Reset Request',
      'Click the link below to reset your password.',
      generateForgotPasswordEmail(user[0].name, user[0].id),
    );
  }

  async changePassword(
    id: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.entityManager.query(
      `SELECT * FROM "user" WHERE "id" = $1 LIMIT 1`,
      [id],
    );
    if (!user.length) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.entityManager.query(
      `UPDATE "user" SET "password" = $1 WHERE "id" = $2`,
      [hashedPassword, id],
    );
    return { message: 'Password changed successfully' };
  }
}
