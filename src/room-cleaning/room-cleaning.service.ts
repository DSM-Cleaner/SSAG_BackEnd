import { Injectable } from "@nestjs/common";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";

@Injectable()
export class RoomCleaningService {
  constructor(
    private readonly roomCleaningRepository: RoomCleaningRepository,
  ) {}

  public async getRoomCleaningListWithRoomId(
    roomId: number,
  ): Promise<RoomCleaning[]> {
    return this.roomCleaningRepository.find({ where: { room_id: roomId } });
  }
}
