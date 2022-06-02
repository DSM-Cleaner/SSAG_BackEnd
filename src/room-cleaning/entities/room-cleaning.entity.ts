import { Room } from "src/room/entities/room.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("roomcleaning")
export class RoomCleaning {
  constructor(init?: Partial<RoomCleaning>) {
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  light: boolean;

  @Column()
  plug: boolean;

  @Column()
  shoes: boolean;

  @Column()
  room_id: number;

  @Column()
  day: string;

  @ManyToOne(() => Room, (room) => room.roomcleaning, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "room_id" })
  room: Room;
}
