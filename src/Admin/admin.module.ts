import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './Users/entity/admin.entity';
import { AdminProfile } from './Users/entity/admin-profile.entity';
import { Announcement } from './Users/entity/announcement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity, AdminProfile, Announcement]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}