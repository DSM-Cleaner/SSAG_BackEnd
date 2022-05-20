import { IsBoolean, IsInt } from "class-validator";

export class CleaningStudentDTO {
  constructor(init?: Partial<CleaningStudentDTO>) {
    Object.assign(this, init);
  }

  @IsInt()
  clothes: number;

  @IsInt()
  bedding: number;

  @IsBoolean()
  personalplace: boolean;

  @IsInt()
  user_id: number;
}
