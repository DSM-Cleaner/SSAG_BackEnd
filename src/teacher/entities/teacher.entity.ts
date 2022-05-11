import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("teacher")
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  gender: boolean;
}
