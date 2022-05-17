import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cleaning')
export class Cleaning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clothes: number;

  @Column()
  bedding: number;

  @Column()
  personalplace: boolean;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.cleaning, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
