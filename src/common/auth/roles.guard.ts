// src/common/auth/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user; // set by a preceding JWT auth guard
    if (!user || !this.roles.some((r) => user.roles?.includes(r))) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
