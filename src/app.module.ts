import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TeacherModule } from "./teacher/teacher.module";
import { CleaningModule } from "./cleaning/cleaning.module";
import { RoomCleaningModule } from "./room-cleaning/room-cleaning.module";
import { RoomModule } from "./room/room.module";
import { TypeOrmConfigModule } from "./typeorm/typeorm-config.module";

@Module({
  imports: [
    TypeOrmConfigModule,
    UserModule,
    TeacherModule,
    CleaningModule,
    RoomCleaningModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
