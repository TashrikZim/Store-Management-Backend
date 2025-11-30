import {Controller,Get,Post,Put,Patch,Delete,Param,Query,Body,} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers') 
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  getAllCustomers() {
    return this.customerService.getAllCustomers();
  }

  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customerService.getCustomerById(Number(id));
  }

  @Get('name/:name')
  getCustomerByName(@Param('name') name: string) {
    return this.customerService.getCustomerByName(name);
  }

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

  @Post()
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Put(':id')
  updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: CreateCustomerDto,
  ) {
    return this.customerService.updateCustomer(
      Number(id),
      updateCustomerDto,
    );
  }

  @Patch(':id/nid')
  updateCustomerNid(
    @Param('id') id: string,
    @Body('nidNumber') nidNumber: string,
    @Body('nidImageSizeMb') nidImageSizeMb: number,
  ) {
    return this.customerService.updateCustomerNid(
      Number(id),
      nidNumber,
      Number(nidImageSizeMb),
    );
  }

  @Delete(':id')
  deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomer(Number(id));
  }
}
