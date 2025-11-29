import { Controller, Post, Body, Patch, Param, Get, Query,UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


@Post('create')
  @UseInterceptors(FileFieldsInterceptor([])) 
  createUser(@Body() body: any) {
    return this.userService.createUser(body);
  }


@Patch(':id/country')
  @UseInterceptors(FileFieldsInterceptor([]))
  updateCountry(@Param('id') id: number, @Body() body: any) {
    return this.userService.updateCountry(id, body.country);
  }

@Get('join-date/:date')
  getByJoinDate(@Param('date') date: string) {
    return this.userService.findByJoiningDate(date);
  }

  @Get('default-country')
  getDefaultCountryUsers() {
    return this.userService.findDefaultCountry();
  }
}
