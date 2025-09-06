
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
    if (!user) {
      throw new UnauthorizedException();
    }
    // Ensure roles is an array (repository might have stored it as string)
    if (typeof (user as any).roles === 'string') {
      try {
        (user as any).roles = JSON.parse((user as any).roles);
      } catch {
        (user as any).roles = [String((user as any).roles)];
      }
    }

    // Remove password_hash before returning user object to guards/controllers
    const safeUser = { ...user } as any;
    if (safeUser.password_hash) {
      delete safeUser.password_hash;
    }

    return safeUser;
  }
}
