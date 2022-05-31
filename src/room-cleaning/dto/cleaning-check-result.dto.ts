import { IsBoolean } from "class-validator";
import { StudentCleaningCheckDTO } from "src/cleaning/dto/student-cleaning-check.dto";

export class CleaningCheckResultDTO {
  constructor(init?: Partial<CleaningCheckResultDTO>) {
    Object.assign(this, init);
  }

  @IsBoolean()
  light: boolean;

  @IsBoolean()
  plug: boolean;

  @IsBoolean()
  shoes: boolean;

  student_list: StudentCleaningCheckDTO[];
}
