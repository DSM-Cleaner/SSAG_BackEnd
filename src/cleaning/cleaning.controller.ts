import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { CleaningService } from "src/cleaning/cleaning.service";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";

@Controller("cleaning")
export class CleaningController {
  constructor(private readonly cleaningService: CleaningService) {}

  @Post("/check/:roomId")
  @HttpCode(HttpStatus.CREATED)
  public async checkCleaning(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Body() cleaningCheck: CleaningCheckDTO,
  ): Promise<CleaningCheckResultDTO> {
    return this.cleaningService.cleaningCheck(roomId, cleaningCheck);
  }
}
