import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roomcleaning')
export class RoomCleaning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  light: boolean;

  @Column()
  plug: boolean;

  @Column()
  shoes: boolean;

  @Column()
  comment: string;

  @Column()
  room_id: number;

  @ManyToOne(() => Room, (room) => room.roomcleaning, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}