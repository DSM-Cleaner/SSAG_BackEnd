import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChangePasswordDto } from "./dto/changePassword.dto";
import { TeacherLoginDTO } from "./dto/login.dto";
import { TeacherService } from "./teacher.service";

@Controller("teacher")
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @HttpCode(201)
  @Post("/login")
  public async teacherLogin(@Body() teacherLoginDto: TeacherLoginDTO) {
    return await this.teacherService.teacherLogin(teacherLoginDto);
  }
}
