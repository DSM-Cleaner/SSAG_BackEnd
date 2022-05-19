import { Injectable } from "@nestjs/common";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";

@Injectable()
export class RoomCleaningService {
  constructor(
    private readonly roomCleaningRepository: RoomCleaningRepository,
  ) {}

  public async saveRoomCleaning(
    roomCleaning: RoomCleaning,
  ): Promise<RoomCleaning> {
    return this.roomCleaningRepository.save(roomCleaning);
  }
}
