import { EntityRepository, Repository } from 'typeorm';
import { Teacher } from './teacher.entity';

@EntityRepository(Teacher)
export class TeacherRepository extends Repository<Teacher> {
  public async changePassword(id, hashPassword) {
    return this.createQueryBuilder()
      .update(Teacher)
      .set({ password: hashPassword })
      .where('teacher.id= :id', { id: id })
      .execute();
  }
}
