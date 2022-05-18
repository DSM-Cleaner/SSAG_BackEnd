import { IsString } from "class-validator";

export class TeacherLoginDTO {
  @IsString()
  name: string;

  @IsString()
  password: string;
}
