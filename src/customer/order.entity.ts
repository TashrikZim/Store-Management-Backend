 import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  productName: string;

  @Column('int')
  quantity: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders)
  customer: CustomerEntity;
}
