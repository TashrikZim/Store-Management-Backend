import {Injectable,UnauthorizedException,BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../customer/customer.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    username: string,
    fullName: string,
    password: string,
  ) {
    
    if (!username || !fullName || !password) {
      throw new BadRequestException(
        'username, fullName and password are required',
      );
    }

    const lowerUsername = username.toLowerCase();

    const existing = await this.customerRepo.findOne({
      where: { username: lowerUsername },
    });
    if (existing) {
      throw new UnauthorizedException('Username already taken');
    }

    const user = this.customerRepo.create({
      username: lowerUsername,
      fullName,
      isActive: true,
    });

    await user.setPassword(password);
    const saved = await this.customerRepo.save(user);

    return { success: true, data: saved };
  }

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }

    const lowerUsername = username.toLowerCase();

    const user = await this.customerRepo.findOne({
      where: { username: lowerUsername },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}
