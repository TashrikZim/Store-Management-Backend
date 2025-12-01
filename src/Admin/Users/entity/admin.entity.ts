import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { AdminProfile } from './admin-profile.entity'
import { Announcement } from './announcement.entity';

@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; 

  @OneToOne(() => AdminProfile, (profile) => profile.admin, { cascade: true })
  @JoinColumn()
  profile: AdminProfile;

  @OneToMany(() => Announcement, (announcement) => announcement.admin)
  announcements: Announcement[];
}