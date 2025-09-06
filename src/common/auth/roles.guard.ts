// src/common/auth/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as unknown as { roles?: unknown } | undefined;
    if (!user) throw new ForbiddenException('Insufficient permissions');

    const rolesVal = user.roles;
    if (!Array.isArray(rolesVal))
      throw new ForbiddenException('Insufficient permissions');

    const has = requiredRoles.some((r) => rolesVal.includes(r));
    if (!has) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
