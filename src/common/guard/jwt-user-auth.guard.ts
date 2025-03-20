import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { getUserById } from 'src/utils/user.utils';
import { EntityManager } from 'typeorm';

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
      const decoded = this.jwtService.decode(token);
      const userData = await getUserById(this.entityManager, decoded?.id);

      if (!userData) {
        throw new UnauthorizedException('User not found');
      }

      if (userData.user_role === Role.ADMIN) {
        throw new ForbiddenException('Access denied: User only');
      }

      return true;
    } catch (error) {
      console.error('JwtAdminAuthGuard error:', error);

      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException({
        message: 'Invalid or expired token',
        code: 'TOKEN_INVALID',
      });
    }
  }
}
