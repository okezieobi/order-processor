// src/common/auth/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as unknown as { roles?: unknown } | undefined;

    if (!user) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const rolesVal = user.roles;
    if (!Array.isArray(rolesVal)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const has = this.roles.some((r) => rolesVal.includes(r));
    if (!has) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
