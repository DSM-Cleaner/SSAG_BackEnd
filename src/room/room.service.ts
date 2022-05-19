import { Injectable } from "@nestjs/common";
import { Room } from "src/room/entities/room.entity";
import { RoomRepository } from "src/room/entities/room.repository";

@Injectable()
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  public async getRoom(roomId: number): Promise<Room> {
    return await this.roomRepository.findOne(roomId);
  }
}
