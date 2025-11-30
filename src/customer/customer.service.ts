
import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

export interface Customer extends CreateCustomerDto {
  id: number;
}

@Injectable()
export class CustomerService {
  private customers: Customer[] = [];
  private currentId = 1;

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

  createCustomer(dto: CreateCustomerDto) {
    const newCustomer: Customer = {
      id: this.currentId++,
      ...dto,
    };
    this.customers.push(newCustomer);

    return {
      success: true,
      message: 'Customer created successfully',
      data: newCustomer,
    };
  }

  updateCustomer(id: number, dto: CreateCustomerDto) {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Customer not found',
        data: null,
      };
    }

    this.customers[index] = { id, ...dto };

    return {
      success: true,
      message: 'Customer updated successfully',
      data: this.customers[index],
    };
  }

  updateCustomerNid(
    id: number,
    nidNumber: string,
    nidImageSizeMb: number,
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
    customer.nidImageSizeMb = nidImageSizeMb;

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
