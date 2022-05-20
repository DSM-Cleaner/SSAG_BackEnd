import { IsBoolean } from "class-validator";
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

  student_list: CleaningStudentDTO[];
}
