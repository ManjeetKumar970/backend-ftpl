import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Role } from 'src/enums/role.enum';
import { getUserById } from 'src/utils/user.utils';

@Injectable()
export class JwtUserAuthGuard implements CanActivate {
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
      const decoded: any = this.jwtService.decode(token);

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

      const userData = await getUserById(this.entityManager, decoded.userId);

      if (!userData) {
        throw new UnauthorizedException({
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }

      if (userData.user_role === Role.ADMIN) {
        throw new ForbiddenException({
          message: 'Access denied: Admin only',
          code: 'ACCESS_DENIED',
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
