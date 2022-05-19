import { Test, TestingModule } from "@nestjs/testing";
import { RoomRepository } from "src/room/entities/room.repository";
import { RoomService } from "../room.service";

describe("RoomService", () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService, RoomRepository],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
