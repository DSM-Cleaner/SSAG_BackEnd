import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { TeacherRepository } from "src/teacher/entities/teacher.repository";
import { TeacherService } from "src/teacher/teacher.service";
import { TeacherController } from "../teacher.controller";

describe("TeacherController", () => {
  let controller: TeacherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        TeacherService,
        TeacherRepository,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
