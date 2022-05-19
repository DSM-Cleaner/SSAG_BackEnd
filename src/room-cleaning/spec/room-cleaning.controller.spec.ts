import { Test, TestingModule } from "@nestjs/testing";
import { RoomCleaningService } from "src/room-cleaning/room-cleaning.service";
import { RoomCleaningController } from "../room-cleaning.controller";

describe("RoomCleaningController", () => {
  let controller: RoomCleaningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomCleaningController],
    }).compile();

    controller = module.get<RoomCleaningController>(RoomCleaningController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
