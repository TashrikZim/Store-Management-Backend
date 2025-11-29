import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Raw } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  createUser(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async updateCountry(id: number, country: string) {
    await this.userRepo.update(id, { country });
    return this.userRepo.findOneBy({ id });
  }


  async findByJoiningDate(dateString: string) {
    return this.userRepo.find({
      where: {
        joiningDate: Raw((abcColumn) => `CAST(${abcColumn} AS DATE) = :date`, { 
          date: dateString 
        }),
      },
    });
  }

  findDefaultCountry() {
    return this.userRepo.find({
      where: { country: 'Unknown' },
    });
  }

}
