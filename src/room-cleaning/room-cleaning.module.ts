import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomCleaningRepository } from "./entities/room-cleaning.repository";
import { RoomCleaningController } from "./room-cleaning.controller";
import { RoomCleaningService } from "./room-cleaning.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoomCleaningRepository])],
  controllers: [RoomCleaningController],
  providers: [RoomCleaningService],
  exports: [RoomCleaningService],
})
export class RoomCleaningModule {}
