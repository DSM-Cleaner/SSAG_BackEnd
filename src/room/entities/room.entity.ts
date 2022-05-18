import { RoomCleaning } from 'src/room-cleaning/entities/room-cleaning.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  floor: number;

  @OneToMany(() => RoomCleaning, (roomcleaning) => roomcleaning.room, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  roomcleaning: RoomCleaning[];

  @OneToMany(() => User, (user) => user.room, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User[];
}
