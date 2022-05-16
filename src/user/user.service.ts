import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(code: string): Promise<User> {
    return await this.userRepository.findOne({ where: { code } });
  }
}
