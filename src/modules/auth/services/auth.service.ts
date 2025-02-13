import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

// Utils
import { encryptedOTP } from '../utils/Otp';

// services
import { OtpMailService } from './oth.services';

// schema
import { User, UserDocument } from '../schemas/user.schema';
import {
  OtpVerification,
  OtpVerificationDocument,
} from '../schemas/otpVerification.schema';

// DTO
import { SignUpDto } from '../dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(OtpVerification.name)
    private otpVerificationModel: Model<OtpVerificationDocument>,
    private readonly OtpMailService: OtpMailService,
    private jwtService: JwtService,
  ) {}

  /**
   * Signup method - Registers a new user
   * @param email - User's email
   * @param password - User's password
   */
  async signUp(
    body: SignUpDto,
    otp: string,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.userModel
      .findOne({
        $or: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
      })
      .exec();
    if (existingUser) {
      throw new ConflictException(
        'Looks like this email/phone number is already registered. Please log in or use a different one."',
      );
    }

    const otpData = await this.otpVerificationModel
      .findOne({ email: body.email })
      .exec();
    if (!otpData) {
      throw new NotFoundException(
        'No OTP found for this email. Please request a new OTP.',
      );
    }

    if (otpData.otp !== otp) {
      throw new ConflictException(
        'The OTP provided is incorrect or expired. Please request a new OTP.',
      );
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create the user
    const newUser = new this.userModel({
      email: body.email,
      password: hashedPassword,
      name: body.name,
      phoneNumber: body.phoneNumber,
    });
    await newUser.save();

    await this.otpVerificationModel.deleteOne({ email: body.email }).exec();

    // Generate JWT token
    const payload = { email: newUser.email, sub: newUser._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Login method - Authenticates user
   * @param email - User's email
   * @param password - User's password
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Correct way to compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // Generate JWT token
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Send OTP method
   * @param email - User's email
   */
  async userOTPRequest(email: string): Promise<{ otp_token: string }> {
    const generateOtp = encryptedOTP();
    await this.OtpMailService.sendEmail(
      email,
      'FTPL Verification OTP',
      generateOtp.otp,
    );

    // Check if OTP record exists and update it; otherwise, create a new one
    await this.otpVerificationModel.findOneAndUpdate(
      { email },
      { otp: generateOtp.otp },
      { upsert: true, new: true },
    );

    return { otp_token: generateOtp.encryptedOTP };
  }
}
