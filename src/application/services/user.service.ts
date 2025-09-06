import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../../interfaces/http/dto/users/create-user.dto';
import { LoginUserDto } from '../../interfaces/http/dto/users/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, firstName, lastName, phone } = createUserDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: UserEntity = {
      email,
      password_hash: hashedPassword,
      firstName,
      lastName,
      phone,
      isActive: true,
      roles: ['user'],
    } as UserEntity;

    return this.userRepository.create(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = jwt.sign(
      { userId: user.id, roles: user.roles },
      'your-secret-key',
      { expiresIn: '1h' },
    );

    return { accessToken };
  }
}
