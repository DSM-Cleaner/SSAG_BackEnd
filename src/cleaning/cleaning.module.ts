import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { RoomCleaningModule } from "src/room-cleaning/room-cleaning.module";
import { RoomRepository } from "src/room/entities/room.repository";
import { RoomModule } from "src/room/room.module";
import { UserRepository } from "src/user/entities/user.repository";
import { UserModule } from "src/user/user.module";
import { CleaningController } from "./cleaning.controller";
import { CleaningService } from "./cleaning.service";
import { CleaningRepository } from "./entities/cleaning.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CleaningRepository,
      RoomRepository,
      RoomCleaningRepository,
      UserRepository,
    ]),
    RoomCleaningModule,
    RoomModule,
    UserModule,
  ],
  controllers: [CleaningController],
  providers: [CleaningService],
  exports: [CleaningService],
})
export class CleaningModule {}
