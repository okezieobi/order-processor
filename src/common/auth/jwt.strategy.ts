
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
    return user;
  }
}
