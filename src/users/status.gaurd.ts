import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requỉedStatus = this.reflector.getAllAndOverride<string[]>('status', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requỉedStatus) {
      return true;
    }
    console.log(requỉedStatus);
    const { user } = context.switchToHttp().getRequest();
    return requỉedStatus.some((status) => user.status.includes(status));
  }
}
