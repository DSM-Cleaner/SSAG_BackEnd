import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserLoginResponseDTO } from "src/user/dto/user-login-response.dto";
import { userLoginDTO } from "src/user/dto/user-login.dto";
import { User } from "src/user/entities/user.entity";
import { UserRepository } from "src/user/entities/user.repository";
import { UserService } from "src/user/user.service";
import { UserController } from "../user.controller";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get("JWT_SECRET_KEY"),
            signOptions: { expiresIn: config.get("TOKEN_EXPIRED_TIME") },
          }),
        }),
      ],
      controllers: [UserController],
      providers: [UserService, UserRepository],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("UserController 로그인", () => {
    it("로그인 실패", async () => {
      jest.spyOn(service, "compareCode").mockResolvedValue(undefined);

      try {
        await controller.login(new userLoginDTO({ code: "aaaaaa" }));
      } catch (error) {
        expect(error.message).toBe("NOTFOUND 찾을 수 없습니다.");
      }
    });

    it("로그인 성공", async () => {
      jest.spyOn(service, "compareCode").mockResolvedValue(
        new User({
          id: 3202,
          code: "111111",
          name: "김재원",
          bed: "C",
          room_id: 306,
        }),
      );

      const result: { authorization: string; id: number } =
        await controller.login(new userLoginDTO({ code: "111111" }));
      expect(result).toStrictEqual(
        new UserLoginResponseDTO({
          authorization: result.authorization,
          id: 3202,
        }),
      );
    });
  });
});
