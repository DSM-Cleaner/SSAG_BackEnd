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
  Header,
  Res,
  Redirect,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CleaningService } from "src/cleaning/cleaning.service";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";

@Controller("cleaning")
export class CleaningController {
  constructor(private readonly cleaningService: CleaningService) {}

  @Get("/:roomId/day/:day")
  public async getCleaningCheck(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Param("day") day: string,
  ): Promise<CleaningCheckResultDTO> {
    return await this.cleaningService.getCleaningCheck(roomId, day);
  }

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

  @Get("/excel")
  @Redirect("/file")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  public async getExcel() {
    const fileName: string = await this.cleaningService.getExcelData();
    return { url: `/file/${fileName}` };
  }

  @Get("/student/:studentId")
  @HttpCode(HttpStatus.OK)
  public async getStudentCleaning(
    @Param("studentId", ParseIntPipe) studentId: number,
  ) {
    return await this.cleaningService.getStudentCleaning(studentId);
  }
}
