import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthService_Customer } from './auth.service';

@Controller('auth/customer')
export class AuthController_Customer {
  constructor(private readonly authService: AuthService_Customer) {}

  @Post('register')
  @UseInterceptors(AnyFilesInterceptor())
  register(
    @Body('username') username: string,
    @Body('fullName') fullName: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(username, fullName, password);
  }

  @Post('login')
  @UseInterceptors(AnyFilesInterceptor())
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }
}
