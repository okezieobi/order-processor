import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/application/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // Replace with a secure key and move to config
    });
  }

  async validate(payload: { userId: string; roles: string[] }) {
    const user = await this.userService.findById(payload.userId);
    if (!user) throw new UnauthorizedException();

    // Narrow roles safely: model may have stored roles as string or array
    const u = user as unknown as { roles?: unknown; password_hash?: unknown };
    const rawRoles = u.roles;
    let safeRoles: string[] = [];
    if (typeof rawRoles === 'string') {
      try {
        const parsed: unknown = JSON.parse(rawRoles);
        if (Array.isArray(parsed)) safeRoles = parsed as string[];
      } catch {
        safeRoles = [String(rawRoles)];
      }
    } else if (Array.isArray(rawRoles)) {
      safeRoles = rawRoles as string[];
    }

    // Return a safe user object with password removed
    const safeUser: Record<string, unknown> = {
      ...(user as unknown as Record<string, unknown>),
    };

    safeUser.roles = safeRoles;
    if ('password_hash' in safeUser) delete safeUser.password_hash;
    return safeUser;
  }
}
