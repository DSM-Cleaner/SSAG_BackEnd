import { Injectable } from "@nestjs/common";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { Cleaning } from "src/cleaning/entities/cleaning.entity";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";

@Injectable()
export class CleaningService {
  constructor(private readonly cleaningRepository: CleaningRepository) {}

  public async saveCleaning(
    cleaningStudent: CleaningStudentDTO,
  ): Promise<Cleaning> {
    return this.cleaningRepository.save(new Cleaning(cleaningStudent));
  }
}
