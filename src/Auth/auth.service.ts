import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from '../Admin/Users/entity/admin.entity'; 
import { AuthDto } from '../Admin/dto/admin-auth.dto'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const { email, password } = authDto;


    const existing = await this.adminRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepo.create({
      email,
      password: hashedPassword,
    });

    return this.adminRepo.save(admin);
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;

    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}