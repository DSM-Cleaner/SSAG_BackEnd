import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserLoginResponseDTO } from 'src/user/dto/user-login-response.dto';
import { userLoginDTO } from './dto/user-login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async login(
    @Body() loginUserDTO: userLoginDTO,
  ): Promise<UserLoginResponseDTO> {
    try {
      const user = await this.userService.compareCode(loginUserDTO.code);
      if (typeof user === 'undefined') {
        throw new Error('NOTFOUND 찾을 수 없습니다.');
      }

      const token: string = await this.userService.login(user);
      return new UserLoginResponseDTO({ authorization: token, id: user.id });
    } catch (error) {
      if (error.message === 'NOTFOUND 찾을 수 없습니다.') {
        throw new HttpException(
          { message: error.message },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        console.log(error);
        throw new Error(error.message);
      }
    }
  }
}
