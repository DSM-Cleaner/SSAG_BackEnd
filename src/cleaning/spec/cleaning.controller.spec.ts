import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { CleaningService } from "src/cleaning/cleaning.service";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { StudentCleaningCheckDTO } from "src/cleaning/dto/student-cleaning-check.dto";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { RoomCleaningService } from "src/room-cleaning/room-cleaning.service";
import { RoomRepository } from "src/room/entities/room.repository";
import { RoomService } from "src/room/room.service";
import { UserRepository } from "src/user/entities/user.repository";
import { UserService } from "src/user/user.service";
import { CleaningController } from "../cleaning.controller";

describe("CleaningController", () => {
  let controller: CleaningController;
  let service: CleaningService;

  let cleaningCheck: CleaningCheckDTO;
  let cleaningRoom1: CleaningStudentDTO;
  let cleaningRoom2: CleaningStudentDTO;
  let cleaningRoom3: CleaningStudentDTO;
  let cleaningCheckWithStudentList: CleaningCheckDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get("JWT_SECRET"),
            signOptions: { expiresIn: config.get("EXPIRES_IN") },
          }),
        }),
      ],
      controllers: [CleaningController],
      providers: [
        CleaningService,
        CleaningRepository,
        RoomCleaningService,
        RoomCleaningRepository,
        RoomService,
        RoomRepository,
        UserService,
        UserRepository,
      ],
    }).compile();

    controller = module.get<CleaningController>(CleaningController);
    service = module.get<CleaningService>(CleaningService);

    cleaningRoom1 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3202,
      day: "???",
    };
    cleaningRoom2 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3201,
      day: "???",
    };
    cleaningRoom3 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3203,
      day: "???",
    };

    cleaningCheck = {
      light: false,
      plug: false,
      shoes: false,
      day: "???",
      student_list: [],
    };

    cleaningCheckWithStudentList = new CleaningCheckDTO({
      ...cleaningCheck,
    });

    cleaningCheckWithStudentList.student_list = [
      cleaningRoom1,
      cleaningRoom2,
      cleaningRoom3,
    ];
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("RoomCleaningController ?????? ??????", () => {
    it.skip("?????? ?????? ??????", async () => {
      await controller.checkCleaning(305, cleaningCheck);
    });

    it("?????? ?????? ??????", async () => {
      const cleaningResult = new CleaningCheckDTO({
        ...cleaningCheck,
        student_list: [
          {
            ...cleaningRoom1,
          },
          {
            ...cleaningRoom2,
          },
          {
            ...cleaningRoom3,
          },
        ],
      });

      jest.spyOn(service, "cleaningCheck").mockResolvedValue(cleaningResult);
      const result: CleaningCheckDTO = await controller.checkCleaning(
        305,
        cleaningCheck,
      );

      expect(result).toEqual(cleaningResult);
    });
  });

  describe("RoomCleaningController ?????? ?????? ??????", () => {
    it.skip("?????? ?????? ?????? ??????(?????? ?????? ??????)", async () => {});
    it("?????? ?????? ?????? ??????", async () => {
      const cleaningCheckResult: CleaningCheckResultDTO =
        new CleaningCheckResultDTO({
          light: false,
          shoes: false,
          plug: false,
          student_list: [
            new StudentCleaningCheckDTO({
              id: 1,
              user_id: 3202,
              bed: "A",
              name: "?????????",
              clothes: 0,
              bedding: 0,
              personalplace: false,
            }),
            new StudentCleaningCheckDTO({
              id: 2,
              user_id: 3201,
              bed: "B",
              name: "?????????",
              clothes: 0,
              bedding: 0,
              personalplace: false,
            }),
            new StudentCleaningCheckDTO({
              id: 3,
              user_id: 3203,
              bed: "C",
              name: "?????????",
              clothes: 0,
              bedding: 0,
              personalplace: false,
            }),
          ],
        });

      jest
        .spyOn(service, "getCleaningCheck")
        .mockResolvedValue(cleaningCheckResult);

      const result = await controller.getCleaningCheck(305, "???");
      expect(result).toBe(cleaningCheckResult);
    });
  });
});
