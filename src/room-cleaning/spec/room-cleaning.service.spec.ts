import { Test, TestingModule } from "@nestjs/testing";
import { RoomCleaningService } from "../room-cleaning.service";

describe("RoomCleaningService", () => {
  let service: RoomCleaningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomCleaningService],
    }).compile();

    service = module.get<RoomCleaningService>(RoomCleaningService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
