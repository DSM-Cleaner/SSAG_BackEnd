import { CleaningStudentResultDTO } from "src/cleaning/dto/cleaning-student-result.dto";

export class CleaningCheckResultDTO {
  constructor(init?: Partial<CleaningCheckResultDTO>) {
    Object.assign(this, init);
  }

  id: number;

  light: boolean;

  plug: boolean;

  shoes: boolean;

  room_id: number;

  comment: string;

  student_list: CleaningStudentResultDTO[];
}
