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
      expiresIn: '1m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '5m',
    });

    this.refreshTokens.set(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  // Validate Refresh Token and Generate New Access Token
  async refreshToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_SECRET,
      });

      if (
        !this.refreshTokens.has(payload.userId) ||
        this.refreshTokens.get(payload.userId) !== oldRefreshToken
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const userExists = await getUserById(this.entityManager, payload.userId);
      if (!userExists) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      const newTokens = await this.generateTokens(
        payload.userId,
        payload.email,
      );
      return newTokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
