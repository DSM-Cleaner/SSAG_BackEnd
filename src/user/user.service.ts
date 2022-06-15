import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "./entities/user.entity";
import { UserRepository } from "./entities/user.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async getUsersWithRoomId(roomId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { room_id: roomId },
      order: { bed: "ASC" },
    });
  }

  async compareCode(code: string): Promise<User> {
    return await this.userRepository.findOne({ where: { code } });
  }

  async login(user: User): Promise<string> {
    return this.jwtService.sign({ id: user.id });
  }
}
