import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ChangePasswordDto } from './dto/change-password.dto';
import { TeacherLoginDTO } from './dto/login.dto';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @HttpCode(201)
  @Post('/login')
  public async teacherLogin(@Body() teacherLoginDto: TeacherLoginDTO) {
    return await this.teacherService.teacherLogin(teacherLoginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @Patch('/:id')
  public async changePassword(
    @Param('id') id,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.teacherService.changePassword(id, changePasswordDto);
    return { message: '비밀번호를 변경하였습니다.' };
  }
}
