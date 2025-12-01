import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './Users/entity/admin.entity';
import { AdminProfile } from './Users/entity/admin-profile.entity';
import { Announcement } from './Users/entity/announcement.entity'
import { CreateProfileDto } from './dto/admin-profile.dto';
import { CreateAnnouncementDto } from './dto/admin-announcement.dto';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(AdminProfile) private profileRepo: Repository<AdminProfile>,
    @InjectRepository(Announcement) private noticeRepo: Repository<Announcement>,
  ) {}

  async createProfile(id: number, profileDto: CreateProfileDto) {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');

    const profile = this.profileRepo.create(profileDto);
    profile.admin = admin;
    return this.profileRepo.save(profile);
  }

  async getDashboard(id: number) {
    return this.adminRepo.findOne({
      where: { id },
      relations: ['profile', 'announcements'],
    });
  }

  async createNotice(id: number, noticeDto: CreateAnnouncementDto) {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');

    const notice = this.noticeRepo.create(noticeDto);
    notice.admin = admin;
    return this.noticeRepo.save(notice);
  }

  async updateNotice(id: number, desc: string) {
    const notice = await this.noticeRepo.findOneBy({ id });
    if (!notice) throw new NotFoundException('Notice not found');
    notice.description = desc;
    return this.noticeRepo.save(notice);
  }

  async deleteNotice(id: number) {
    return this.noticeRepo.delete(id);
  }
async updateProfileFull(id: number, dto: CreateProfileDto) {
  const profile = await this.profileRepo.findOneBy({ id });
  if (!profile) throw new NotFoundException('Profile not found');

  profile.fullName = dto.fullName;
  profile.mobile = dto.mobile;
  profile.gender = dto.gender;
  profile.city = dto.city;

  return this.profileRepo.save(profile);
}

async getProfile(id: number) {
  const profile = await this.profileRepo.findOne({
    where: { id },
    relations: ['admin'],
  });

  if (!profile) throw new NotFoundException('Profile not found');
  return profile;
}

async patchProfile(id: number, partialData: any) {
  const profile = await this.profileRepo.findOneBy({ id });
  if (!profile) throw new NotFoundException('Profile not found');

  Object.assign(profile, partialData);
  return this.profileRepo.save(profile);
}

async deleteProfile(id: number) {
  const result = await this.profileRepo.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException('Profile not found');
  }
  return { message: 'Profile deleted successfully' };
}
}