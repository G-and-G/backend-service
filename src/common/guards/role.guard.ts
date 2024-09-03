import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator'; // Import the custom roles decorator
export enum Role {
  HOTEL_ADMIN,
  NORMAL,
  DELIVERER,
  SUPER_ADMIN,
} // Import the Role enum (or define it in this file)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false; // User is not authenticated
    }
    return requiredRoles.some((role) => {
      return user.role === role;
    });
  }
}
