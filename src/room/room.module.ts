import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomRepository } from "./entites/room.repository";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoomRepository])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
