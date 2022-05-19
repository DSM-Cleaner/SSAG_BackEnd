import { Injectable } from "@nestjs/common";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { Cleaning } from "src/cleaning/entities/cleaning.entity";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";
import { notFoundRoomIdException } from "src/exception/exception.index";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningService } from "src/room-cleaning/room-cleaning.service";
import { Room } from "src/room/entities/room.entity";
import { RoomService } from "src/room/room.service";

@Injectable()
export class CleaningService {
  constructor(
    private readonly cleaningRepository: CleaningRepository,
    private readonly roomCleaningService: RoomCleaningService,
    private readonly roomService: RoomService,
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
      student_list.map(
        async (student) => await this.cleaningRepository.save(student),
      ),
    );

    const cleaningCheckResult: CleaningCheckResultDTO = {
      ...savedRoomCleaning,
      student_list: saved_student_list,
    };

    return cleaningCheckResult;
  }
}
