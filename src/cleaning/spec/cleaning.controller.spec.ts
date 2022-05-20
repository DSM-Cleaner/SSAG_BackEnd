import { Test, TestingModule } from "@nestjs/testing";
import { CleaningService } from "src/cleaning/cleaning.service";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { RoomCleaningService } from "src/room-cleaning/room-cleaning.service";
import { RoomRepository } from "src/room/entities/room.repository";
import { RoomService } from "src/room/room.service";
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
      controllers: [CleaningController],
      providers: [
        CleaningService,
        CleaningRepository,
        RoomCleaningService,
        RoomCleaningRepository,
        RoomService,
        RoomRepository,
      ],
    }).compile();

    controller = module.get<CleaningController>(CleaningController);
    service = module.get<CleaningService>(CleaningService);

    cleaningRoom1 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3202,
    };
    cleaningRoom2 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3201,
    };
    cleaningRoom3 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3203,
    };

    cleaningCheck = {
      light: false,
      plug: false,
      shoes: false,
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

  describe("RoomCleaningController 청소 검사", () => {
    it.skip("청소 검사 실패", async () => {
      await controller.checkCleaning(305, cleaningCheck);
    });

    it("청소 검사 성공", async () => {
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
});
