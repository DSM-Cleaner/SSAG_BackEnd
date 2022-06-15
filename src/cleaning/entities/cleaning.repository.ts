import { decode } from "punycode";
import { EntityRepository, Repository } from "typeorm";
import { Cleaning } from "./cleaning.entity";

@EntityRepository(Cleaning)
export class CleaningRepository extends Repository<Cleaning> {
  public async getbedInfo(room_id, day) {
    return await this.createQueryBuilder("cleaning")
      .leftJoin("cleaning.user", "user")
      .leftJoin("user.room", "room")
      .select("user.id", "gcn")
      .addSelect("user.name", "name")
      .addSelect("cleaning.bedding", "bedding")
      .addSelect("cleaning.clothes", "clothes")
      .addSelect("cleaning.personalplace", "personalplace")
      .where("room.id= :room_id", { room_id: room_id })
      .andWhere("cleaning.day= :day", { day: day })
      .getRawMany();
  }

  public async getStudentCleaning(studentId) {
    return await this.createQueryBuilder("cleaning")
      .leftJoin("cleaning.user", "user")
      .leftJoin("user.room", "room")
      .leftJoin("room.roomcleaning", "roomcleaning")
      .select("roomcleaning.day", "day")
      .addSelect("roomcleaning.light", "light")
      .addSelect("roomcleaing.plug", "plug")
      .addSelect("roomcleaning.shoes", "shoes")
      .addSelect("cleaning.clothes", "clothes")
      .addSelect("cleaning.bedding", "bedding")
      .addSelect("cleaning.personalplace", "personalplace")
      .where("user.id= :id", { id: studentId })
      .getRawMany();
  }
}
