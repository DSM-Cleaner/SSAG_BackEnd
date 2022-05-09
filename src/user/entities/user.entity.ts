import { Cleaning } from "src/cleaning/entities/cleaning.entity";
import { Room } from "src/room/entites/room.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  gcn: number;

  @Column()
  name: string;

  @Column()
  bed: string;

  @Column()
  room_id: number;

  @ManyToOne(() => Room, (room) => room.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "room_id" })
  room: Room;

  @OneToMany(() => Cleaning, (cleaning) => cleaning.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  cleaning: Cleaning[];
}
