import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeacherRepository } from "./entities/teacher.repository";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    TypeOrmModule.forFeature([TeacherRepository]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET_KEY"),
        signOptions: { expiresIn: config.get("TOKEN_EXPIRED_TIME") },
      }),
    }),
  ],
  providers: [TeacherService],
  controllers: [TeacherController],
  exports: [TeacherService],
})
export class TeacherModule {}
