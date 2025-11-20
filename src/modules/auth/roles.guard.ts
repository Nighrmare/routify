/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
// Guard to protect routes based on user roles
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles required for the route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are defined, allow access
    if (!requiredRoles) return true;

    // Get user object from request
    const { user } = context.switchToHttp().getRequest();

    // If no user is attached, forbid access
    if (!user) throw new ForbiddenException('User is not authenticated');

    // If user's role is not in required roles, forbid access
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }
    // Allow access
    return true;
  }
}
