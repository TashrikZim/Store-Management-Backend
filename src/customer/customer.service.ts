import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerEntity } from './customer.entity';

export interface Customer {
  id: number;
  name: string;
  email: string;
  nidNumber: string;
  nidImageFileName?: string;
  nidImageSizeMb?: number;
}

@Injectable()
export class CustomerService {
  private customers: Customer[] = [];
  private currentId = 1;

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
  ) {}

  getAllCustomers() {
    return {
      success: true,
      data: this.customers,
    };
  }

  getCustomerById(id: number) {
    const customer = this.customers.find((c) => c.id === id);
    return {
      success: !!customer,
      data: customer ?? null,
      message: customer ? 'Customer found' : 'Customer not found',
    };
  }

  getCustomerByName(name: string) {
    const matched = this.customers.filter(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    return {
      success: true,
      data: matched,
    };
  }

  searchCustomer(id?: number, name?: string) {
    const result = this.customers.filter((c) => {
      const matchId = id ? c.id === id : true;
      const matchName = name
        ? c.name.toLowerCase().includes(name.toLowerCase())
        : true;
      return matchId && matchName;
    });

    return {
      success: true,
      data: result,
    };
  }

  createCustomer(dto: CreateCustomerDto, nidImage: any) {
    const nidImageSizeMb = nidImage
      ? Number((nidImage.size / (1024 * 1024)).toFixed(2))
      : undefined;

    const newCustomer: Customer = {
      id: this.currentId++,
      name: dto.name,
      email: dto.email,
      nidNumber: dto.nidNumber,
      nidImageFileName: nidImage?.originalname,
      nidImageSizeMb,
    };

    this.customers.push(newCustomer);

    return {
      success: true,
      message: 'Customer created successfully',
      data: newCustomer,
    };
  }

  updateCustomer(
    id: number,
    dto: CreateCustomerDto,
    nidImage?: any,
  ) {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Customer not found',
        data: null,
      };
    }

    const existing = this.customers[index];

    const nidImageSizeMb = nidImage
      ? Number((nidImage.size / (1024 * 1024)).toFixed(2))
      : existing.nidImageSizeMb;

    this.customers[index] = {
      ...existing,
      name: dto.name,
      email: dto.email,
      nidNumber: dto.nidNumber,
      nidImageFileName: nidImage
        ? nidImage.originalname
        : existing.nidImageFileName,
      nidImageSizeMb,
    };

    return {
      success: true,
      message: 'Customer updated successfully',
      data: this.customers[index],
    };
  }

  updateCustomerNid(
    id: number,
    nidNumber: string,
    nidImageSizeMb?: number,
  ) {
    const customer = this.customers.find((c) => c.id === id);
    if (!customer) {
      return {
        success: false,
        message: 'Customer not found',
        data: null,
      };
    }

    customer.nidNumber = nidNumber;
    if (nidImageSizeMb !== undefined) {
      customer.nidImageSizeMb = nidImageSizeMb;
    }

    return {
      success: true,
      message: 'Customer NID info updated',
      data: customer,
    };
  }

  deleteCustomer(id: number) {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Customer not found',
        data: null,
      };
    }

    const deleted = this.customers.splice(index, 1)[0];

    return {
      success: true,
      message: 'Customer deleted successfully',
      data: deleted,
    };
  }

  async createCategory3User(
    username: string,
    fullName: string,
    isActive?: boolean,
  ) {
    const entity = this.customerRepo.create({
      username,
      fullName,
      isActive: isActive ?? false,
    });
    const saved = await this.customerRepo.save(entity);
    return {
      success: true,
      message: 'Customer (DB) created successfully',
      data: saved,
    };
  }

  async findUsersByFullNameSubstring(substring: string) {
    const users = await this.customerRepo.find({
      where: { fullName: ILike(`%${substring}%`) },
    });
    return {
      success: true,
      data: users,
    };
  }

  async findUserByUsername(username: string) {
    const user = await this.customerRepo.findOne({
      where: { username: username.toLowerCase() },
    });
    return {
      success: !!user,
      data: user ?? null,
      message: user ? 'User found' : 'User not found',
    };
  }

  async removeUserByUsername(username: string) {
    const user = await this.customerRepo.findOne({
      where: { username: username.toLowerCase() },
    });
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    await this.customerRepo.remove(user);
    return {
      success: true,
      message: 'User removed successfully',
      data: user,
    };
  }
}
