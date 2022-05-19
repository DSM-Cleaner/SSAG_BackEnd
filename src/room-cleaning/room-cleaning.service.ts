import { Injectable } from "@nestjs/common";
import { CleaningService } from "src/cleaning/cleaning.service";
import { notFoundRoomIdException } from "src/exception/exception.index";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { Room } from "src/room/entities/room.entity";
import { RoomService } from "src/room/room.service";

@Injectable()
export class RoomCleaningService {
  constructor(
    private readonly roomCleaningRepository: RoomCleaningRepository,
    private readonly roomService: RoomService,
    private readonly cleaningService: CleaningService,
  ) {}

  public async cleaningCheck(roomId: number, cleaningCheck: CleaningCheckDTO) {
    let saved_student_list = [];
    const room: Room = await this.roomService.getRoom(roomId);
    if (typeof room == "undefined") {
      throw notFoundRoomIdException;
    }
    const { light, plug, shoes, student_list } = cleaningCheck;
    let savedRoomCleaning: RoomCleaning;
    try {
      savedRoomCleaning = await this.roomCleaningRepository.save(
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
        async (student) => await this.cleaningService.saveCleaning(student),
      ),
    );

    const cleaningCheckResult: CleaningCheckResultDTO = {
      ...savedRoomCleaning,
      student_list: saved_student_list,
    };

    return cleaningCheckResult;
  }
}
