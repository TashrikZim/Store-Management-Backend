import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './Users/entity/admin.entity';
import { AdminProfile } from './Users/entity/admin-profile.entity';
import { Announcement } from './Users/entity/announcement.entity';
import { CreateProfileDto } from './dto/admin-profile.dto';
import { CreateAnnouncementDto } from './dto/admin-announcement.dto';
import { MailService } from '../mailer/mail.service';
import Pusher from 'pusher'; 

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(AdminProfile) private profileRepo: Repository<AdminProfile>,
    @InjectRepository(Announcement) private noticeRepo: Repository<Announcement>,
    private readonly mailService: MailService, 
  ) {}

  async createProfile(id: number, profileDto: CreateProfileDto) {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');

    const existingProfile = await this.profileRepo.findOne({ 
        where: { admin: { id: id } } 
    });
    
    if (existingProfile) {
        throw new BadRequestException('This Admin already has a profile!');
    }

    const profile = this.profileRepo.create(profileDto);
    profile.admin = admin;
    return this.profileRepo.save(profile);
  }

  async createNotice(id: number, noticeDto: CreateAnnouncementDto) {
    const pusher = new Pusher({
      appId: "2101066",
      key: "f6c17c53ac3a9f03eb3f",
      secret: "763f1eb77d83bd7390e2",
      cluster: "ap2",
      useTLS: true
    });

    //  Find Admin
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');

    // Save to Database
    const notice = this.noticeRepo.create(noticeDto);
    notice.admin = admin;
    const savedNotice = await this.noticeRepo.save(notice);

    // Trigger Pusher Event
    await pusher.trigger("notice-channel", "new-notice", {
      message: "New Announcement: " + noticeDto.title,
      description: noticeDto.description
    });

    // Send Email
 
    await this.mailService.sendAnnouncementEmail(
        admin.email, 
        noticeDto.title, 
        noticeDto.description
    );

    return { message: 'Notice created, Broadcasted via Pusher, and Email sent!', data: savedNotice };
  }

  async getDashboard(id: number) {
    return this.adminRepo.findOne({
      where: { id },
      relations: ['profile', 'announcements'],
    });
  }

  async updateNotice(id: number, desc: string) {
    const notice = await this.noticeRepo.findOneBy({ id });
    if (!notice) throw new NotFoundException('Notice not found');
    notice.description = desc;
    return this.noticeRepo.save(notice);
  }

  async deleteNotice(id: number) {
    const result = await this.noticeRepo.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException('Notice not found');
    }
    return { message: 'Notice deleted successfully' };
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

  // FOR EDIT PROFILE
  async getProfile2(email: string) {
    const admin = await this.adminRepo.findOne({ where: { email: email } });
    if (!admin) {
      throw new NotFoundException('Admin User not found');
    }

    const result = await this.profileRepo.query(
      `SELECT * FROM admin_profiles WHERE "adminId" = $1`, 
      [admin.id]
    );

    const profile = result[0]; 

    return {
      id: profile ? profile.id : null, 
      fullName: profile ? profile.fullName : "N/A",
      email: admin.email,
      mobile: profile ? profile.mobile : "N/A",
      city: profile ? profile.city : "N/A",
      gender: profile ? profile.gender : "N/A"
    };
  }
}