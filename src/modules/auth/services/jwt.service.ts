import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { getUserById } from 'src/utils/user.utils';
import { EntityManager } from 'typeorm';

@Injectable()
export class JWTService {
  private refreshTokens = new Map<string, string>(); // Store refresh tokens

  constructor(
    private readonly jwtService: JwtService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  // Generate Access and Refresh Tokens
  async generateTokens(userId: string, email: string) {
    const payload = { userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1m', // 1-minute expiration for testing
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '3m', // 3-minute expiration for testing
    });

    // Store refresh token in memory
    this.refreshTokens.set(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  // Validate Refresh Token and Generate New Access Token
  async refreshToken(
    oldRefreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      // ✅ Use REFRESH_SECRET for validation
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

      // Check if refresh token exists and matches the stored one
      if (
        !this.refreshTokens.has(payload.userId) ||
        this.refreshTokens.get(payload.userId) !== oldRefreshToken
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify user still exists
      const userExists = await getUserById(this.entityManager, payload.userId);
      if (!userExists) {
        throw new UnauthorizedException('User not found.');
      }

      // ✅ Remove old refresh token & issue new one
      this.refreshTokens.delete(payload.userId);
      const newTokens = await this.generateTokens(
        payload.userId,
        payload.email,
      );

      return {
        access_token: newTokens?.accessToken,
        refresh_token: newTokens?.refreshToken,
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new UnauthorizedException({
        status: 402,
        message: 'Token has expired',
        errorCode: 'REFRESH_TOKEN_EXPIRED',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
