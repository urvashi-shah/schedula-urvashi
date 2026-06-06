import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.name,
      signupDto.email,
      signupDto.password,
      signupDto.role,
    );
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
    );
  }
}