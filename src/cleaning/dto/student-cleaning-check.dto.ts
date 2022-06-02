import { IsBoolean, IsNumber, IsString } from "class-validator";

export class StudentCleaningCheckDTO {
  constructor(init?: Partial<StudentCleaningCheckDTO>) {
    Object.assign(this, init);
  }

  @IsNumber()
  id: number;

  @IsNumber()
  user_id: number;

  @IsString()
  bed: string;

  @IsString()
  name: string;

  @IsNumber()
  clothes: number;

  @IsNumber()
  bedding: number;

  @IsBoolean()
  personalplace: boolean;
}
