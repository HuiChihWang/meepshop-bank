import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class SqlTransactionUtil {
  constructor(private readonly dataSource: DataSource) {}

  async runWithTransaction(sqlOpts: (e: EntityManager) => Promise<void>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const entityManager = queryRunner.manager;
    try {
      await sqlOpts(entityManager);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('Transaction Fail!');
    } finally {
      await queryRunner.release();
    }
  }
}
