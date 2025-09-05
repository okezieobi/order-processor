/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserController } from '../interfaces/http/controllers/user.controller';
import { UserService } from '../application/services/user.service';
import { UserRepository } from '../domain/repositories/user.repository';
import { ObjectionUserRepository } from '../infrastructure/objection/repositories/objection-user.repository';
import { JwtStrategy } from '../common/auth/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key', // Replace with a secure key and move to config
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: UserRepository, useClass: ObjectionUserRepository },
    JwtStrategy,
  ],
  exports: [PassportModule, JwtModule],
})
export class UserModule {}
