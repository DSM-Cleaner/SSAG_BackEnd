import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { TeacherRepository } from "src/teacher/entities/teacher.repository";
import { TeacherService } from "../teacher.service";

describe("TeacherService", () => {
  let service: TeacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TeacherService>(TeacherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
