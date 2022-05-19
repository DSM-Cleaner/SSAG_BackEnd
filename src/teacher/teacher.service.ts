import { Injectable } from '@nestjs/common';
import {
  notConfirmPasswordException,
  notFoundTeacherIdException,
  notFoundTeacherNameException,
} from 'src/exception/exception.index';
import { TeacherLoginDTO } from './dto/login.dto';
import { Teacher } from './entities/teacher.entity';
import { TeacherRepository } from './entities/teacher.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async teacherLogin(teacherLoginDto: TeacherLoginDTO) {
    const { name, password } = teacherLoginDto;

    const teacher: Teacher = await this.teacherRepository.findOne({
      where: { name },
    });
    if (!teacher) {
      throw notFoundTeacherNameException;
    }

    const confirmPassword: boolean = await bcrypt.compare(
      password,
      teacher.password,
    );
    if (!confirmPassword) {
      throw notConfirmPasswordException;
    }

    const payload = {
      name: name,
      id: teacher.id,
      gender: teacher.gender,
    };

    return {
      token: this.jwtService.sign(payload),
      id: teacher.id,
      gender: teacher.gender,
    };
  }

  public async changePassword(id, changePasswordDto: ChangePasswordDto) {
    const teacher: Teacher = await this.teacherRepository.findOne({
      where: { id },
    });
    if (!teacher) throw notFoundTeacherIdException;

    const confirmPassword: boolean = await bcrypt.compare(
      changePasswordDto.password,
      teacher.password,
    );
    if (!confirmPassword) throw notConfirmPasswordException;

    const hashPassword = await bcrypt.hash(changePasswordDto.new_password, 12);
    changePasswordDto.new_password = hashPassword;

    return await this.teacherRepository.changePassword(id, hashPassword);
  }
}
