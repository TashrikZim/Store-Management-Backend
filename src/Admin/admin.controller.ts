import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Put,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdminDto } from './dto/admin.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private admins = [
    { id: 1, name: 'Tanjil', mail: 'tanjil@gmail.com' },
    { id: 2, name: 'Tashrik', mail: 'tashrik@gmail.com' },
  ];

  @Post('/validate')
  @UseInterceptors(FileFieldsInterceptor([])) 
  validateAdmin(@Body() adminData: AdminDto) {
    return {
      message: 'Admin data validated successfully!',
      data: adminData,
    };
  }

  @Get('/all')
  getAll() {
    return this.admins;
  }

  @Post('/create')
  createAdmin(@Body() adminData: AdminDto) {
    console.log(adminData);
    return this.adminService.createAdmin(adminData);
  }

  @Get('/search/find')
  searchAdmin(@Query('username') username: string) {
    return this.adminService.searchAdmin(username);
  }

  @Delete(':id')
  deleteAdmin(@Param('id') id: string) {
    const deleted = this.admins.splice(+id - 1, 1);
    return { message: 'Admin deleted', data: deleted[0] };
  }

  @Put(':id')
  replaceAdmin(@Param('id') id: string, @Body() data: any) {
    this.admins[+id - 1] = { id: +id, ...data };
    return { message: 'Admin replaced', data: this.admins[+id - 1] };
  }

  @Patch(':id')
  updateAdmin(@Param('id') id: string, @Body() data: any) {
    this.admins[+id - 1] = { ...this.admins[+id - 1], ...data };
    return this.adminService.patchMessage(this.admins[+id - 1]);
  }

  @Get('/allSellers')
  getAllSellers() {
    return this.adminService.getAllSellers();
  }

  @Get('/categories')
  getAllcategories() {
    return this.adminService.getAllcategories();
  }
}
