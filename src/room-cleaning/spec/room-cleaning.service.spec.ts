import { Test, TestingModule } from "@nestjs/testing";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { RoomCleaningService } from "../room-cleaning.service";

describe("RoomCleaningService", () => {
  let service: RoomCleaningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomCleaningService, RoomCleaningRepository],
    }).compile();

    service = module.get<RoomCleaningService>(RoomCleaningService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
