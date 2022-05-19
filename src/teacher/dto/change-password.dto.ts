import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  password: string;

  @IsString()
  new_password: string;
}
