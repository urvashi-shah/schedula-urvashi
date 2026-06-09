import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Register a new user',
  })
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.name,
      signupDto.email,
      signupDto.password,
      signupDto.role,
    );
  }

  @ApiOperation({
    summary: 'Login and get JWT token',
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
    );
  }
}