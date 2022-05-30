import { Injectable } from "@nestjs/common";
import { bindNodeCallback } from "rxjs";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { Cleaning } from "src/cleaning/entities/cleaning.entity";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";
import { notFoundRoomIdException } from "src/exception/exception.index";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { RoomCleaningService } from "src/room-cleaning/room-cleaning.service";
import { Room } from "src/room/entities/room.entity";
import { RoomRepository } from "src/room/entities/room.repository";
import { RoomService } from "src/room/room.service";

@Injectable()
export class CleaningService {
  constructor(
    private readonly cleaningRepository: CleaningRepository,
    private readonly roomCleaningService: RoomCleaningService,
    private readonly roomService: RoomService,
    private readonly roomRepository: RoomRepository,
    private readonly roomCleaningRepository: RoomCleaningRepository,
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
    const { light, plug, shoes, student_list } = cleaningCheck;
    let savedRoomCleaning: RoomCleaning;
    try {
      savedRoomCleaning = await this.roomCleaningService.saveRoomCleaning(
        new RoomCleaning({
          light: light,
          plug: plug,
          shoes: shoes,
          room_id: roomId,
          room: room,
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
        });
      }),
    );

    const cleaningCheckResult: CleaningCheckDTO = {
      light: savedRoomCleaning.light,
      plug: savedRoomCleaning.plug,
      shoes: savedRoomCleaning.shoes,
      student_list: saved_student_list,
    };

    return cleaningCheckResult;
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
}
