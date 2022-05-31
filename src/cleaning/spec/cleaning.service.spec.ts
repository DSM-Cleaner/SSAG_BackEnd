import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { StudentCleaningCheckDTO } from "src/cleaning/dto/student-cleaning-check.dto";
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
import { User } from "src/user/entities/user.entity";
import { UserRepository } from "src/user/entities/user.repository";
import { UserService } from "src/user/user.service";
import { CleaningService } from "../cleaning.service";

describe("CleaningService", () => {
  let service: CleaningService;
  let roomCleaningRepository: RoomCleaningRepository;
  let roomRepository: RoomRepository;
  let cleaningRepository: CleaningRepository;
  let userRepository: UserRepository;

  let cleaningCheck: CleaningCheckDTO;
  let cleaningCheckWithStudentList: CleaningCheckDTO;
  let cleaningRoom1: CleaningStudentDTO;
  let cleaningRoom2: CleaningStudentDTO;
  let cleaningRoom3: CleaningStudentDTO;

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

    service = module.get<CleaningService>(CleaningService);
    roomCleaningRepository = module.get<RoomCleaningRepository>(
      RoomCleaningRepository,
    );
    roomRepository = module.get<RoomRepository>(RoomRepository);
    cleaningRepository = module.get<CleaningRepository>(CleaningRepository);
    userRepository = module.get<UserRepository>(UserRepository);

    cleaningRoom1 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3202,
      day: "월",
    };
    cleaningRoom2 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3201,
      day: "월",
    };
    cleaningRoom3 = {
      clothes: 0,
      bedding: 0,
      personalplace: null,
      user_id: 3203,
      day: "월",
    };

    cleaningCheck = {
      light: false,
      plug: false,
      shoes: false,
      day: "월",
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
          day: "월",
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
      const expectCleaningCheckResult: CleaningCheckDTO = new CleaningCheckDTO({
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

      const cleaningCheckResult = await service.cleaningCheck(
        305,
        cleaningCheckWithStudentList,
      );
      expect(cleaningCheckResult).toEqual(expectCleaningCheckResult);
    });
  });

  describe("CleaningService 호실 정보 조회", () => {
    it("호실 정보 조회 실패(User 조회 실패)", async () => {
      jest
        .spyOn(roomRepository, "findOne")
        .mockResolvedValue(new Room({ id: 305 }));
      jest.spyOn(userRepository, "find").mockResolvedValue([]);
      try {
        await service.getCleaningCheck(305, "월");
      } catch (error) {
        expect(error.message).toBe("NotFound StudentId");
      }
    });
    it.skip("호실 정보 조회 실패(Cleaning 조회 실패) 없을 수도 있을 것 같아서 제와", async () => {
      jest
        .spyOn(roomRepository, "findOne")
        .mockResolvedValue(new Room({ id: 305, floor: 3 }));
      jest.spyOn(userRepository, "find").mockResolvedValue([
        new User({
          id: 3202,
          code: "111111",
          name: "김재원",
          bed: "A",
          room_id: 305,
        }),
        new User({
          id: 3201,
          code: "111111",
          name: "이서준",
          bed: "B",
          room_id: 305,
        }),
        new User({
          id: 3203,
          code: "111111",
          name: "조호원",
          bed: "C",
          room_id: 305,
        }),
      ]);
      jest.spyOn(cleaningRepository, "findOne").mockResolvedValue(undefined);
      try {
        await service.getCleaningCheck(305, "월");
      } catch (error) {
        expect(error.message).toBe("NotFound Cleaning");
      }
    });
    it.skip("호실 정보 조회 실패(RoomCleaning 조회 실패) 없을 수도 있을 것 같아서 제와", async () => {
      jest
        .spyOn(roomRepository, "findOne")
        .mockResolvedValue(new Room({ id: 305, floor: 3 }));
      jest.spyOn(userRepository, "find").mockResolvedValue([
        new User({
          id: 3202,
          code: "111111",
          name: "김재원",
          bed: "A",
          room_id: 305,
        }),
        new User({
          id: 3201,
          code: "111111",
          name: "이서준",
          bed: "B",
          room_id: 305,
        }),
        new User({
          id: 3203,
          code: "111111",
          name: "조호원",
          bed: "C",
          room_id: 305,
        }),
      ]);
      jest
        .spyOn(cleaningRepository, "findOne")
        .mockResolvedValue(new Cleaning({ id: 1, ...cleaningRoom1 }));
      jest.spyOn(roomCleaningRepository, "find").mockResolvedValue([]);
      try {
        await service.getCleaningCheck(305, "월");
      } catch (error) {
        expect(error.message).toBe("NotFound RoomCleaning");
      }
    });
    it("호실 정보 조회 성공", async () => {
      jest
        .spyOn(roomRepository, "findOne")
        .mockResolvedValue(new Room({ id: 305, floor: 3 }));
      jest.spyOn(userRepository, "find").mockResolvedValue([
        new User({
          id: 3202,
          code: "111111",
          name: "김재원",
          bed: "A",
          room_id: 305,
        }),
        new User({
          id: 3201,
          code: "111111",
          name: "이서준",
          bed: "B",
          room_id: 305,
        }),
        new User({
          id: 3203,
          code: "111111",
          name: "조호원",
          bed: "C",
          room_id: 305,
        }),
      ]);
      jest
        .spyOn(cleaningRepository, "findOne")
        .mockResolvedValueOnce(
          new Cleaning({
            id: 1,
            bedding: cleaningRoom1.bedding,
            clothes: cleaningRoom1.clothes,
            personalplace: cleaningRoom1.personalplace,
            user_id: cleaningRoom1.user_id,
          }),
        )
        .mockResolvedValueOnce(
          new Cleaning({
            id: 2,
            bedding: cleaningRoom2.bedding,
            clothes: cleaningRoom2.clothes,
            personalplace: cleaningRoom2.personalplace,
            user_id: cleaningRoom2.user_id,
          }),
        )
        .mockResolvedValueOnce(
          new Cleaning({
            id: 3,
            bedding: cleaningRoom3.bedding,
            clothes: cleaningRoom3.clothes,
            personalplace: cleaningRoom3.personalplace,
            user_id: cleaningRoom3.user_id,
          }),
        );
      jest
        .spyOn(roomCleaningRepository, "findOne")
        .mockResolvedValue(new RoomCleaning(cleaningCheck));

      const result = await service.getCleaningCheck(305, "월");
      expect(result).toEqual(
        new CleaningCheckResultDTO({
          ...cleaningCheck,
          student_list: [
            new StudentCleaningCheckDTO({
              id: 1,
              user_id: 3202,
              name: "김재원",
              bed: "A",
              bedding: cleaningRoom1.bedding,
              clothes: cleaningRoom1.clothes,
              personalplace: cleaningRoom1.personalplace,
            }),
            new StudentCleaningCheckDTO({
              id: 2,
              user_id: 3201,
              name: "이서준",
              bed: "B",
              bedding: cleaningRoom2.bedding,
              clothes: cleaningRoom2.clothes,
              personalplace: cleaningRoom2.personalplace,
            }),
            new StudentCleaningCheckDTO({
              id: 3,
              user_id: 3203,
              name: "조호원",
              bed: "C",
              bedding: cleaningRoom3.bedding,
              clothes: cleaningRoom3.clothes,
              personalplace: cleaningRoom3.personalplace,
            }),
          ],
        }),
      );
    });
  });
});
