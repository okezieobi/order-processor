/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

import { UserService } from '../../../application/services/user.service';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { LoginUserDto } from '../dto/users/login-user.dto';
import { Public } from '../../../common/auth/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @Public()
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Post('signup-admin')
  @Public()
  signupAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto, ['users', 'admins']);
  }

  @Post('login')
  @Public()
  @ApiBody({
    type: LoginUserDto,
    examples: {
      a: {
        summary: 'Example user',
        value: { email: 'test@example.com', password: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
    schema: {
      example: {
        accessToken: 'your_access_token',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
