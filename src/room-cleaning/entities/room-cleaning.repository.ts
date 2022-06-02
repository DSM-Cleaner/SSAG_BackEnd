import { EntityRepository, Repository } from "typeorm";
import { RoomCleaning } from "./room-cleaning.entity";

@EntityRepository(RoomCleaning)
export class RoomCleaningRepository extends Repository<RoomCleaning> {
  public async getRoomCleaningWeek(room_id) {
    return await this.createQueryBuilder("roomcleaning")
      .select("roomcleaning.day", "day")
      .addSelect("roomcleaning.light", "light")
      .addSelect("roomcleaning.plug", "plug")
      .addSelect("roomcleaning.shoes", "shoes")
      .where("roomcleaning.room_id= :room_id", { room_id: room_id })
      .getRawMany();
  }
}
