import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

class DBTransactionError extends HttpException {
  constructor() {
    super('Transaction fail', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

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
      throw new DBTransactionError();
    } finally {
      await queryRunner.release();
    }
  }
}
