import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './customer.entity';
import { CustomerProfile } from './customer-profile.entity';
import { Order } from './order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, CustomerProfile, Order])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
