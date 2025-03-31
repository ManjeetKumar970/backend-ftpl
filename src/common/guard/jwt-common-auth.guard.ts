import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { getUserById } from 'src/utils/user.utils';
import { EntityManager } from 'typeorm';

@Injectable()
export class JwtCommonAuthGuard implements CanActivate {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        message: 'No token provided',
        code: 'TOKEN_MISSING',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Decode the token without verifying the signature
      const decoded = this.jwtService.decode(token);
      const userData = await getUserById(this.entityManager, decoded?.userId);
      if (!decoded || !decoded.userId) {
        throw new UnauthorizedException({
          message: 'Invalid token payload',
          code: 'TOKEN_INVALID',
        });
      }

      // Check if the token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new UnauthorizedException({
          status: 402,
          message: 'Token has expired',
          errorCode: 'TOKEN_EXPIRED',
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        });
      }

      request.user = userData; // Attach user data to request
      return true;
    } catch (error) {
      console.error('JwtUserAuthGuard error:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        statusCode: 402,
        message: error.message || 'Invalid or expired token',
        errorCode: 'TOKEN_INVALID',
        timestamp: new Date().toISOString(),
        path: context.switchToHttp().getRequest().url, // Include request path
      });
    }
  }
}
