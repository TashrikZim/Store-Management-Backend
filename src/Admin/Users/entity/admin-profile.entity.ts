import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'; // 👈 Import JoinColumn
import { AdminEntity } from './admin.entity';

@Entity('admin_profiles')
export class AdminProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  mobile: string;

  @Column()
  gender: string;

  @Column()
  city: string;


  @OneToOne(() => AdminEntity, (admin) => admin.profile)
  @JoinColumn() 
  admin: AdminEntity;
}