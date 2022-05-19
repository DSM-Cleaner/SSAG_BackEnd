import { Test, TestingModule } from "@nestjs/testing";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { Cleaning } from "src/cleaning/entities/cleaning.entity";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { RoomCleaningService } from "src/room-cleaning/room-cleaning.service";
import { Room } from "src/room/entities/room.entity";
import { RoomRepository } from "src/room/entities/room.repository";
import { RoomService } from "src/room/room.service";
import { CleaningService } from "../cleaning.service";

describe("CleaningService", () => {
  let service: CleaningService;
  let roomCleaningRepository: RoomCleaningRepository;
  let roomRepository: RoomRepository;
  let cleaningRepository: CleaningRepository;

  let cleaningCheck: CleaningCheckDTO;
  let cleaningCheckWithStudentList: CleaningCheckDTO;
  let cleaningRoom1: CleaningStudentDTO;
  let cleaningRoom2: CleaningStudentDTO;
  let cleaningRoom3: CleaningStudentDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleaningService,
        CleaningRepository,
        RoomCleaningService,
        RoomCleaningRepository,
        RoomService,
        RoomRepository,
      ],
    }).compile();

    service = module.get<CleaningService>(CleaningService);
    roomCleaningRepository = module.get<RoomCleaningRepository>(
      RoomCleaningRepository,
    );
    roomRepository = module.get<RoomRepository>(RoomRepository);
    cleaningRepository = module.get<CleaningRepository>(CleaningRepository);

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
    expect(service).toBeDefined();
  });

  describe("CleaningService 호실 청소", () => {
    it("호실 청소 실패(Room 조회 실패)", async () => {
      jest.spyOn(roomRepository, "findOne").mockResolvedValue(undefined);
      try {
        await service.cleaningCheck(305, cleaningCheckWithStudentList);
      } catch (error) {
        expect(error.message).toBe("NotFound RoomId");
      }
    });

    it("호실 청소 실패(RoomCleaning 외래키로 인한 저장 실패)", async () => {
      jest
        .spyOn(roomRepository, "findOne")
        .mockResolvedValue(new Room({ id: 305, floor: 3 }));
      jest
        .spyOn(roomCleaningRepository, "save")
        .mockRejectedValue(
          new Error(
            "Cannot add or update a child row: a foreign key constraint fails (`ssag`.`roomcleaing`, CONSTRAINT `FK_753dbca3509bd2b8a38a2ead079` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE)",
          ),
        );
      try {
        await service.cleaningCheck(305, cleaningCheckWithStudentList);
      } catch (error) {
        expect(error.message).toBe("NotFound RoomId");
      }
    });

    it("호실 청소 성공", async () => {
      jest
        .spyOn(roomRepository, "findOne")
        .mockResolvedValue(new Room({ id: 305, floor: 3 }));
      jest.spyOn(roomCleaningRepository, "save").mockResolvedValue(
        new RoomCleaning({
          id: 1,
          light: false,
          plug: false,
          shoes: false,
          room_id: 305,
        }),
      );
      jest
        .spyOn(cleaningRepository, "save")
        .mockResolvedValueOnce(
          new Cleaning({
            id: 1,
            ...cleaningRoom1,
          }),
        )
        .mockResolvedValueOnce(
          new Cleaning({
            id: 2,
            ...cleaningRoom2,
          }),
        )
        .mockResolvedValueOnce(
          new Cleaning({
            id: 3,
            ...cleaningRoom3,
          }),
        );
      const expectCleaningCheckResult: CleaningCheckResultDTO =
        new CleaningCheckResultDTO({
          id: 1,
          ...cleaningCheck,
          room_id: 305,
          student_list: [
            {
              id: 1,
              ...cleaningRoom1,
            },
            {
              id: 2,
              ...cleaningRoom2,
            },
            {
              id: 3,
              ...cleaningRoom3,
            },
          ],
        });

      const cleaningCheckResult = await service.cleaningCheck(
        305,
        cleaningCheckWithStudentList,
      );
      expect(cleaningCheckResult).toEqual(expectCleaningCheckResult);
    });
  });
});
