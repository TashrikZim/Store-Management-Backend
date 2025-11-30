// src/customer/customer.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerValidationPipe } from './pipes/customer-validation.pipe';

@Controller('customers') // base path: /customers
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // 1) GET /customers
  @Get()
  getAllCustomers() {
    return this.customerService.getAllCustomers();
  }

  // 2) GET /customers/:id
  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customerService.getCustomerById(Number(id));
  }

  // 3) GET /customers/name/:name
  @Get('name/:name')
  getCustomerByName(@Param('name') name: string) {
    return this.customerService.getCustomerByName(name);
  }

  // 4) GET /customers/search?id=&name=
  @Get('search')
  searchCustomer(
    @Query('id') id?: string,
    @Query('name') name?: string,
  ) {
    return this.customerService.searchCustomer(
      id ? Number(id) : undefined,
      name,
    );
  }

  // 5) POST /customers  -> form-data: text fields + nidImage file
  @Post()
  @UseInterceptors(
    FileInterceptor('nidImage', {
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    }),
  )
  @UsePipes(CustomerValidationPipe)
  createCustomer(
    @UploadedFile() nidImage: any,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    if (!nidImage) {
      throw new BadRequestException('NID image file is required');
    }

    const sizeMb = nidImage.size / (1024 * 1024);
    if (sizeMb > 2) {
      throw new BadRequestException(
        'NID image must not be more than 2 MB',
      );
    }

    return this.customerService.createCustomer(
      createCustomerDto,
      nidImage,
    );
  }

  // 6) PUT /customers/:id  -> full update, optional new nidImage file
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('nidImage', {
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    }),
  )
  @UsePipes(CustomerValidationPipe)
  updateCustomer(
    @Param('id') id: string,
    @UploadedFile() nidImage: any,
    @Body() updateCustomerDto: CreateCustomerDto,
  ) {
    if (nidImage) {
      const sizeMb = nidImage.size / (1024 * 1024);
      if (sizeMb > 2) {
        throw new BadRequestException(
          'NID image must not be more than 2 MB',
        );
      }
    }

    return this.customerService.updateCustomer(
      Number(id),
      updateCustomerDto,
      nidImage,
    );
  }

  // 7) PATCH /customers/:id/nid (simple: only nidNumber, optional size)
  @Patch(':id/nid')
  updateCustomerNid(
    @Param('id') id: string,
    @Body('nidNumber') nidNumber: string,
    @Body('nidImageSizeMb') nidImageSizeMb?: string,
  ) {
    const sizeNumber = nidImageSizeMb
      ? Number(nidImageSizeMb)
      : undefined;

    return this.customerService.updateCustomerNid(
      Number(id),
      nidNumber,
      sizeNumber,
    );
  }

  // 8) DELETE /customers/:id
  @Delete(':id')
  deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomer(Number(id));
  }
}
