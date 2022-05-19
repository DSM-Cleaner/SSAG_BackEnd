import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CleaningModule } from "src/cleaning/cleaning.module";
import { RoomModule } from "src/room/room.module";
import { RoomCleaningRepository } from "./entities/room-cleaning.repository";
import { RoomCleaningController } from "./room-cleaning.controller";
import { RoomCleaningService } from "./room-cleaning.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomCleaningRepository]),
    RoomModule,
    CleaningModule,
  ],
  controllers: [RoomCleaningController],
  providers: [RoomCleaningService],
})
export class RoomCleaningModule {}
