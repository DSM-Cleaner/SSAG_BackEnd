import { Injectable } from "@nestjs/common";
import { notFoundStudentIdException } from "src/exception/exception.index";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { Cleaning } from "src/cleaning/entities/cleaning.entity";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";
import { notFoundRoomIdException } from "src/exception/exception.index";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { RoomCleaningService } from "src/room-cleaning/room-cleaning.service";
import { Room } from "src/room/entities/room.entity";
import { RoomRepository } from "src/room/entities/room.repository";
import { RoomService } from "src/room/room.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { StudentCleaningCheckDTO } from "src/cleaning/dto/student-cleaning-check.dto";
import { UserRepository } from "src/user/entities/user.repository";

@Injectable()
export class CleaningService {
  constructor(
    private readonly cleaningRepository: CleaningRepository,
    private readonly roomCleaningService: RoomCleaningService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly roomRepository: RoomRepository,
    private readonly roomCleaningRepository: RoomCleaningRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async saveCleaning(cleaning: Cleaning): Promise<Cleaning> {
    return this.cleaningRepository.save(cleaning);
  }

  public async cleaningCheck(roomId: number, cleaningCheck: CleaningCheckDTO) {
    let saved_student_list = [];
    const room: Room = await this.roomService.getRoom(roomId);
    if (typeof room == "undefined") {
      throw notFoundRoomIdException;
    }
    const { light, plug, shoes, student_list, day } = cleaningCheck;
    let savedRoomCleaning: RoomCleaning;
    try {
      savedRoomCleaning = await this.roomCleaningService.saveRoomCleaning(
        new RoomCleaning({
          light: light,
          plug: plug,
          shoes: shoes,
          room_id: roomId,
          room: room,
          day: day,
        }),
      );
    } catch (error) {
      if (error.message.indexOf("foreign key constraint fails") !== -1) {
        throw notFoundRoomIdException;
      }
    }

    saved_student_list = await Promise.all(
      student_list.map(async (student) => {
        const cleaning: Cleaning = await this.cleaningRepository.save(student);
        return new CleaningStudentDTO({
          clothes: cleaning.clothes,
          bedding: cleaning.bedding,
          personalplace: cleaning.personalplace,
          user_id: cleaning.user_id,
          day: cleaning.day,
        });
      }),
    );

    const cleaningCheckResult: CleaningCheckDTO = {
      light: savedRoomCleaning.light,
      plug: savedRoomCleaning.plug,
      shoes: savedRoomCleaning.shoes,
      day: savedRoomCleaning.day,
      student_list: saved_student_list,
    };

    return cleaningCheckResult;
  }

  public async getCleaningCheck(roomId: number, day: string) {
    const student_list: StudentCleaningCheckDTO[] = [];

    const foundUsers: User[] = await this.userService.getUsersWithRoomId(
      roomId,
    );
    if (foundUsers.length === 0) {
      throw notFoundStudentIdException;
    }

    foundUsers.map(async (user) => {
      const cleaning: Cleaning = await this.cleaningRepository.findOne({
        where: { user_id: user.id, day: day },
      });

      student_list.push(
        new StudentCleaningCheckDTO({
          id: cleaning.id,
          user_id: user.id,
          bed: user.bed,
          name: user.name,
          clothes: cleaning.clothes,
          bedding: cleaning.bedding,
          personalplace: cleaning.personalplace,
        }),
      );
    });

    const roomCleaning = await this.roomCleaningService.getRoomCleaning(roomId);

    return new CleaningCheckResultDTO({
      ...roomCleaning,
      student_list: student_list,
    });
  }

  public async getWeekRooms() {
    const roomList = await this.roomRepository.getRooms();

    return await Promise.all(
      roomList.map(async (room) => {
        const roomCleaningWeek =
          await this.roomCleaningRepository.getRoomCleaningWeek(room.id);

        return {
          roomId: room.id,
          results: await Promise.all(
            roomCleaningWeek.map(async (day) => {
              const bedInfos = await this.cleaningRepository.getbedInfo(
                room.id,
                day.day,
              );
              return {
                day: day.day,
                light: day.light,
                plug: day.plug,
                shoes: day.shoes,
                A: bedInfos[0],
                B: bedInfos[1],
                C: bedInfos[2],
              };
            }),
          ),
        };
      }),
    );
  }

  public async getStudentCleaning(id: number) {
    const user: User = await this.userRepository.findOne({
      where: { id },
    });

    const roomCleaningWeek =
      await this.roomCleaningRepository.getRoomCleaningWeek(user.room_id);

    const results = await Promise.all(
      roomCleaningWeek.map(async (ele) => {
        const studentInfo = await this.cleaningRepository.studentCleaningInfo(
          id,
          ele.day,
        );

        return {
          day: ele.day,
          light: ele.light,
          plug: ele.plug,
          shoes: ele.shoes,
          bedding: studentInfo?.bedding,
          clothes: studentInfo?.clothes,
          personalplace: studentInfo?.personalplace,
        };
      }),
    );
    return {
      name: user.name,
      gcn: user.id,
      roomId: user.room_id,
      bed: user.bed,
      results,
    };
  }
}
