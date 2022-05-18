import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/entities/user.repository';
import { UserService } from 'src/user/user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get('JWT_SECRET'),
            signOptions: { expiresIn: config.get('EXPIRES_IN') },
          }),
        }),
      ],
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
      const result = await service.compareCode('aaaaaa');

      expect(result).toBeUndefined();
    });

    it('로그인 성공', async () => {
      const user: User = new User({
        id: 3202,
        code: '111111',
        name: '김재원',
        bed: 'C',
        room_id: 306,
      });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const result = await service.compareCode('111111');

      expect(result).toBe(user);
    });
  });
});
