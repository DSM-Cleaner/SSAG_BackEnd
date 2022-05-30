import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CleaningService } from "src/cleaning/cleaning.service";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";

@Controller("cleaning")
export class CleaningController {
  constructor(private readonly cleaningService: CleaningService) {}

  @Post("/check/:roomId")
  @HttpCode(HttpStatus.CREATED)
  public async checkCleaning(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Body() cleaningCheck: CleaningCheckDTO,
  ): Promise<CleaningCheckDTO> {
    return this.cleaningService.cleaningCheck(roomId, cleaningCheck);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/week-rooms")
  @HttpCode(HttpStatus.OK)
  public async getWeekRooms() {
    return this.cleaningService.getWeekRooms();
  }
}
