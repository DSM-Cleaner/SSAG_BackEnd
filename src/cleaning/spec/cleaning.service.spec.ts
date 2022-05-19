import { Test, TestingModule } from "@nestjs/testing";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";
import { CleaningService } from "../cleaning.service";

describe("CleaningService", () => {
  let service: CleaningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleaningService, CleaningRepository],
    }).compile();

    service = module.get<CleaningService>(CleaningService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
