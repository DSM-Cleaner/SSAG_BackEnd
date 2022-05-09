import { EntityRepository, Repository } from "typeorm";
import { RoomCleaning } from "./room-cleaning.entity";

@EntityRepository(RoomCleaning)
export class RoomCleaningRepository extends Repository<RoomCleaning> {}
