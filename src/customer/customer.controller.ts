import {Controller,Get,Post,Put,Patch,Delete,Param,Query,Body,UsePipes,UseInterceptors,UploadedFile,BadRequestException,UseGuards,} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerValidationPipe } from './pipes/customer-validation.pipe';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';


@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  //Task 2: in-memory + file upload 
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
  @UseInterceptors(
    FileInterceptor('nidImage', {
      limits: { fileSize: 2 * 1024 * 1024 },
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

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('nidImage', {
      limits: { fileSize: 2 * 1024 * 1024 },
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

  @Delete(':id')
  deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomer(Number(id));
  }
  //Task 3: User Category 3 DB operations
  @Post('category3')
  @UseInterceptors(AnyFilesInterceptor())
  async createCategory3User(
    @Body('username') username: string,
    @Body('fullName') fullName: string,
    @Body('isActive') isActive?: string,
  ) {
    const isActiveBool =
      isActive !== undefined
        ? isActive === 'true' || isActive === '1'
        : undefined;
    return this.customerService.createCategory3User(
      username,
      fullName,
      isActiveBool,
    );
  }

  @Get('category3/search-by-fullname')
  async searchByFullName(@Query('contains') contains: string) {
    return this.customerService.findUsersByFullNameSubstring(contains);
  }

  @Get('category3/username/:username')
  async getByUsername(@Param('username') username: string) {
    return this.customerService.findUserByUsername(username);
  }

  @Delete('category3/username/:username')
  async deleteByUsername(@Param('username') username: string) {
    return this.customerService.removeUserByUsername(username);
  }

  //Relationship routes
  @UseGuards(JwtAuthGuard)
@Post(':id/profile')
@UseInterceptors(AnyFilesInterceptor())   
async upsertProfile(
  @Param('id') id: string,
  @Body('address') address: string,
  @Body('phone') phone: string,
) {
  return this.customerService.upsertProfile(
    Number(id),
    address,
    phone,
  );
}

  @UseGuards(JwtAuthGuard)
  @Post(':id/orders')
  @UseInterceptors(AnyFilesInterceptor())
  async createOrder(
    @Param('id') id: string,
    @Body('productName') productName: string,
    @Body('quantity') quantity: string,
  ) {
    return this.customerService.createOrder(
      Number(id),
      productName,
      Number(quantity),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/orders')
  async getOrders(@Param('id') id: string) {
    return this.customerService.getOrdersByCustomer(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/orders/:orderId')
  async deleteOrder(
    @Param('id') id: string,
    @Param('orderId') orderId: string,
  ) {
    return this.customerService.deleteOrder(
      Number(id),
      Number(orderId),
    );
  }
}
