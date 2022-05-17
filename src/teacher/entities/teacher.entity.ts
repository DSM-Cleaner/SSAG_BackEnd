import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("teacher")
export class Teacher {
  @PrimaryColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  gender: boolean;
}
