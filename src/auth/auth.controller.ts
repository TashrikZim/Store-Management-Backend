import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Post('register')
  @UseInterceptors(AnyFilesInterceptor())
  register(
    @Body('username') username: string,
    @Body('fullName') fullName: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(username, fullName, password);
  }

  // POST /auth/login
  @Post('login')
  @UseInterceptors(AnyFilesInterceptor())
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }
}
