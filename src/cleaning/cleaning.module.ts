import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomCleaningModule } from "src/room-cleaning/room-cleaning.module";
import { RoomModule } from "src/room/room.module";
import { CleaningController } from "./cleaning.controller";
import { CleaningService } from "./cleaning.service";
import { CleaningRepository } from "./entities/cleaning.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([CleaningRepository]),
    RoomCleaningModule,
    RoomModule,
  ],
  controllers: [CleaningController],
  providers: [CleaningService],
  exports: [CleaningService],
})
export class CleaningModule {}
