import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async getStudentInfo(studentId) {
    return await this.createQueryBuilder("user")
      .select("user.name", "name")
      .addSelect("user.gcn", "gcn")
      .addSelect("user.roomId", "roomId")
      .addSelect("user.bed", "bed")
      .where("user.id: = id", { id: studentId })
      .getMany();
  }
}
