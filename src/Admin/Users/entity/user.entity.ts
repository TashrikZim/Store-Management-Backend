import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  uniqueId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joiningDate: Date;

  @Column({ type: 'varchar', length: 30, default: 'Unknown' })
  country: string;



  @BeforeInsert()
  setDefaults() {
    this.uniqueId = randomUUID();

    if (!this.country || this.country.trim() === '') {
      this.country = 'Unknown';
    }
  }
}
