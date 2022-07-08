import { EntityRepository, Repository } from "typeorm";
import { Room } from "./room.entity";

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  public async getRooms() {
    return await this.createQueryBuilder("room").select("room.id").getMany();
  }

  public async getRoomsWithStudent() {
    return await this.createQueryBuilder("room")
      .leftJoinAndSelect("room.user", "user")
      .where("room.id = user.room_id")
      .orderBy("room.id")
      .addOrderBy("user.bed")
      .getMany();
  }

  public async getAllData() {
    return await this.createQueryBuilder("room")
      .leftJoinAndSelect("room.user", "user")
      .where("room.id = user.room_id")
      .leftJoinAndSelect("room.roomcleaning", "roomcleaning")
      .andWhere("room.id = roomcleaning.room_id")
      .leftJoinAndSelect("user.cleaning", "cleaning")
      .andWhere("user.id = cleaning.user_id")
      .andWhere("cleaning.day = roomcleaning.day")
      .orderBy("room.id")
      .addOrderBy("roomcleaning.id")
      .getMany();
  }
}
