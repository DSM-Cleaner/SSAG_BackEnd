import { IsString } from "class-validator";

export class userLoginDTO {
  constructor(init?: Partial<userLoginDTO>) {
    Object.assign(this, init);
  }

  @IsString()
  code: string;
}
