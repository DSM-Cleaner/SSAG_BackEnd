import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async getStudentInfo(id) {
    return await this.createQueryBuilder("user")
      .select("user.name", "name")
      .addSelect("user.id", "gcn")
      .addSelect("user.room_id", "roomId")
      .addSelect("user.bed", "bed")
      .where("user.id= :id", { id: id })
      .getRawMany();
  }

  public async getStudentRoomId(id) {
    return await this.createQueryBuilder("user")
      .select("user.room_id", "room_id")
      .where("user.id= :id", { id: id })
      .getRawOne();
  }
}
