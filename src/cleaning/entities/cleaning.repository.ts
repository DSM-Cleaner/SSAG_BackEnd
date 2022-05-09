import { EntityRepository, Repository } from "typeorm";
import { Cleaning } from "./cleaning.entity";

@EntityRepository(Cleaning)
export class CleaningRepository extends Repository<Cleaning> {}
