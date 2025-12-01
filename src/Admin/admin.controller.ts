import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Put, Request, UseInterceptors} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { CreateProfileDto } from './dto/admin-profile.dto';
import { CreateAnnouncementDto } from './dto/admin-announcement.dto';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('profile')
  @UseInterceptors(FileFieldsInterceptor([])) 
  createProfile(@Request() req, @Body() profileDto: CreateProfileDto) {
    return this.adminService.createProfile(req.user.id, profileDto);
  }

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.adminService.getDashboard(req.user.id);
  }

  @Post('notice')
  @UseInterceptors(FileFieldsInterceptor([]))  
  createNotice(@Request() req, @Body() noticeDto: CreateAnnouncementDto) {
    return this.adminService.createNotice(req.user.id, noticeDto);
  }

  @Patch('notice/:id')
  @UseInterceptors(FileFieldsInterceptor([]))  
  updateNotice(@Param('id') id: number, @Body('description') desc: string) {
    return this.adminService.updateNotice(id, desc);
  }

  @Delete('notice/:id')
  deleteNotice(@Param('id') id: number) {
    return this.adminService.deleteNotice(id);
  }

@Put('profile/:id')
@UseInterceptors(FileFieldsInterceptor([]))
updateProfileFull(
  @Param('id') id: number,
  @Body() profileDto: CreateProfileDto
) {
  return this.adminService.updateProfileFull(id, profileDto);
}

@Get('profile/:id')
getProfile(@Param('id') id: number) {
  return this.adminService.getProfile(id);
}


@Patch('profile/:id')
@UseInterceptors(FileFieldsInterceptor([]))
patchProfile(
  @Param('id') id: number,
  @Body() body: any
) {
  return this.adminService.patchProfile(id, body);
}

@Delete('profile/:id')
deleteProfile(@Param('id') id: number) {
  return this.adminService.deleteProfile(id);
}


}
