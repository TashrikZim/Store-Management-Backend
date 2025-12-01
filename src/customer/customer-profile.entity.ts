import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('customer_profile')
export class CustomerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  address: string;

  @Column({ length: 20 })
  phone: string;

  @OneToOne(() => CustomerEntity, (customer) => customer.profile)
  customer: CustomerEntity;
}
