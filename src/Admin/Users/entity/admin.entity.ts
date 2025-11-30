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
  password: string; // Stores Hashed Password

  // Relation 1: One-to-One with Profile
  @OneToOne(() => AdminProfile, (profile) => profile.admin, { cascade: true })
  @JoinColumn()
  profile: AdminProfile;

  // Relation 2: One-to-Many with Announcements
  @OneToMany(() => Announcement, (announcement) => announcement.admin)
  announcements: Announcement[];
}