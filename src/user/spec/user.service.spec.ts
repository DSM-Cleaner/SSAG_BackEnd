import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { UserRepository } from '../entities/user.repository';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('UserService 유저 로그인', () => {
    it('로그인 실패', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
      const result = await service.login('aaaaaa');

      expect(result).toBeUndefined();
    });

    it('로그인 성공', async () => {
      const user: User = new User({id: 1, code: '111111', gcn: 3202, name: '김재원', bed: 'C', room_id: 306});

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const result = await service.login('111111');

      expect(result).toBe(user);
    });
  });
});
