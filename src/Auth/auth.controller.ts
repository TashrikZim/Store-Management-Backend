import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { AuthDto } from '../Admin/dto/admin-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileFieldsInterceptor([]))  
  register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Post('login')
  @UseInterceptors(FileFieldsInterceptor([]))   
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
