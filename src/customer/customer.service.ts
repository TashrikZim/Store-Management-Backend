 import {Injectable,NotFoundException, BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerEntity } from './customer.entity';
import { CustomerProfile } from './customer-profile.entity';
import { Order } from './order.entity';

//Task 2 in-memory structure
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
  // Task 2 in-memory
  private customers: Customer[] = [];
  private currentId = 1;

  // Task 3+4 DB repos
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(CustomerProfile)
    private readonly profileRepo: Repository<CustomerProfile>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  //Task 2 methods (in-memory + file upload) 
  getAllCustomers() {
    return { success: true, data: this.customers };
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
    return { success: true, data: matched };
  }
  searchCustomer(id?: number, name?: string) {
    const result = this.customers.filter((c) => {
      const matchId = id ? c.id === id : true;
      const matchName = name
        ? c.name.toLowerCase().includes(name.toLowerCase())
        : true;
      return matchId && matchName;
    });
    return { success: true, data: result };
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

  updateCustomer(id: number, dto: CreateCustomerDto, nidImage?: any) {
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

  //Task 3 DB methods (User Category 3)
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
    return { success: true, data: users };
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
  //  Relationship methods (profile + orders) 

  async upsertProfile(
    customerId: number,
    address: string,
    phone: string,
  ) {
    if (!address || !phone) {
    throw new BadRequestException('address and phone are required');
  }
    const customer = await this.customerRepo.findOne({
      where: { id: customerId },
      relations: ['profile'],
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    let profile = customer.profile;
    if (!profile) {
      profile = this.profileRepo.create({ address, phone, customer });
    } else {
      profile.address = address;
      profile.phone = phone;
    }

    const saved = await this.profileRepo.save(profile);
    return { success: true, data: saved };
  }

  async createOrder(
    customerId: number,
    productName: string,
    quantity: number,
  ) {
    const customer = await this.customerRepo.findOneBy({ id: customerId });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const order = this.orderRepo.create({
      productName,
      quantity,
      customer,
    });
    const saved = await this.orderRepo.save(order);
    return { success: true, data: saved };
  }

  async getOrdersByCustomer(customerId: number) {
    const orders = await this.orderRepo.find({
      where: { customer: { id: customerId } },
    });
    return { success: true, data: orders };
  }

  async deleteOrder(customerId: number, orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, customer: { id: customerId } },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepo.remove(order);
    return { success: true, message: 'Order deleted' };
  }
}
