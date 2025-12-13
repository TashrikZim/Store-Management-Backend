import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, Admin } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => AdminEntity, (admin) => admin.announcements)
  admin: AdminEntity;


}