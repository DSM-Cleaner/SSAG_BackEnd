import { IsBoolean, IsString } from "class-validator";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";

export class CleaningCheckDTO {
  constructor(init?: Partial<CleaningCheckDTO>) {
    Object.assign(this, init);
  }

  @IsBoolean()
  light: boolean;

  @IsBoolean()
  plug: boolean;

  @IsBoolean()
  shoes: boolean;

  @IsString()
  day: string;

  student_list: CleaningStudentDTO[];
}
