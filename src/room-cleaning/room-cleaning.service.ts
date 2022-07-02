import { Injectable } from "@nestjs/common";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";

@Injectable()
export class RoomCleaningService {
  constructor(
    private readonly roomCleaningRepository: RoomCleaningRepository,
  ) {}

  public async getRoomCleaning(roomId: number): Promise<RoomCleaning> {
    return this.roomCleaningRepository.findOne({
      where: { room_id: roomId },
    });
  }

  public async getRoomCleaningByDay(
    roomId: number,
    day: string,
  ): Promise<RoomCleaning> {
    return this.roomCleaningRepository.findOne({
      where: { room_id: roomId, day: day },
    });
  }

  public async getRoomCleaningListWithRoomId(
    roomId: number,
  ): Promise<RoomCleaning[]> {
    return this.roomCleaningRepository.find({ where: { room_id: roomId } });
  }

  public async saveRoomCleaning(
    roomCleaning: RoomCleaning,
  ): Promise<RoomCleaning> {
    return this.roomCleaningRepository.save(roomCleaning);
  }
}
