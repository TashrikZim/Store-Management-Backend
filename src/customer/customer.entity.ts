import {Entity,PrimaryGeneratedColumn,Column,BeforeInsert,OneToOne,OneToMany,JoinColumn,} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CustomerProfile } from './customer-profile.entity';
import { Order } from './order.entity';

@Entity('customer_category3')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;


  @Column({ type: 'varchar', length: 200, nullable: true })
  passwordHash: string;


  @OneToOne(() => CustomerProfile, (profile) => profile.customer, {
    cascade: true,
  })
  @JoinColumn()
  profile: CustomerProfile;


  @OneToMany(() => Order, (order) => order.customer, {
    cascade: true,
  })
  orders: Order[];

  @BeforeInsert()
  normalizeUsername() {
    if (this.username) {
      this.username = this.username.toLowerCase();
    }
  }

  async setPassword(plain: string) {
    const salt = await bcrypt.genSalt();
    this.passwordHash = await bcrypt.hash(plain, salt);
  }
}
