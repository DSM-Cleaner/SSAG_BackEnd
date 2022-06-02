import { IsNumber, IsString } from "class-validator";

export class UserLoginResponseDTO {
  constructor(init?: Partial<UserLoginResponseDTO>) {
    Object.assign(this, init);
  }
  @IsString()
  authorization: string;

  @IsNumber()
  id: number;
}
