import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requỉedRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requỉedRoles) {
      return true;
    }
    console.log(requỉedRoles);
    const { user } = context.switchToHttp().getRequest();
    return requỉedRoles.some((role) => user.role.includes(role));
  }
}
