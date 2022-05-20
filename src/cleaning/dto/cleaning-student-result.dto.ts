export class CleaningStudentResultDTO {
  constructor(init?: Partial<CleaningStudentResultDTO>) {
    Object.assign(this, init);
  }

  id: number;

  clothes: number;

  bedding: number;

  personalplace: boolean;
}
