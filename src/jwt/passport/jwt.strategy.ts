import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { badRequestException } from "src/exception/exception.index";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { TeacherRepository } from "src/teacher/entities/teacher.repository";
import { Payload } from "../payload/jwt.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly teacherRepository: TeacherRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const teacher = await this.teacherRepository.findOne({
      where: { teacherId: payload.teacherId },
    });

    if (teacher) {
      return teacher;
    } else {
      throw badRequestException;
    }
  }
}
