import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { RoomCleaningModule } from "src/room-cleaning/room-cleaning.module";
import { RoomRepository } from "src/room/entities/room.repository";
import { RoomModule } from "src/room/room.module";
import { CleaningController } from "./cleaning.controller";
import { CleaningService } from "./cleaning.service";
import { CleaningRepository } from "./entities/cleaning.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CleaningRepository,
      RoomRepository,
      RoomCleaningRepository,
    ]),
    RoomCleaningModule,
    RoomModule,
  ],
  controllers: [CleaningController],
  providers: [CleaningService],
  exports: [CleaningService],
})
export class CleaningModule {}
