// src/customer/customer.service.ts

import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

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

  // 1) GET /customers
  getAllCustomers() {
    return {
      success: true,
      data: this.customers,
    };
  }

  // 2) GET /customers/:id
  getCustomerById(id: number) {
    const customer = this.customers.find((c) => c.id === id);
    return {
      success: !!customer,
      data: customer ?? null,
      message: customer ? 'Customer found' : 'Customer not found',
    };
  }

  // 3) GET /customers/name/:name
  getCustomerByName(name: string) {
    const matched = this.customers.filter(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    return {
      success: true,
      data: matched,
    };
  }

  // 4) GET /customers/search?id=&name=
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

  // 5) POST /customers (with NID image file)
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

  // 6) PUT /customers/:id (full update, optional new NID image file)
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

  // 7) PATCH /customers/:id/nid (only NID info, no file here)
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

  // 8) DELETE /customers/:id
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
}
