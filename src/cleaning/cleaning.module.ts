import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CleaningController } from "./cleaning.controller";
import { CleaningService } from "./cleaning.service";
import { CleaningRepository } from "./entities/cleaning.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CleaningRepository])],
  controllers: [CleaningController],
  providers: [CleaningService],
})
export class CleaningModule {}
