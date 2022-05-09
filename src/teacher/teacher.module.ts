import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeacherRepository } from "./entities/teacher.repository";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";

@Module({
  imports: [TypeOrmModule.forFeature([TeacherRepository])],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
