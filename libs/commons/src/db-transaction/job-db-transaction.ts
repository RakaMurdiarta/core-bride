import { DataSource, EntityManager } from 'typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import Logger, { LoggerKey } from '@logger/domain/logger';

export const __DbTransactionalJobServiceTOKEN = Symbol(
  'DbTransactionalJobService',
);

@Injectable({
  scope: Scope.REQUEST,
})
export class DbTransactionalJobService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(LoggerKey) private logger: Logger,
  ) {}
  public withTx = async <T>(
    callback: (transactionalEntityManager: EntityManager) => Promise<T>,
  ) => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const data = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return data as unknown as T;
    } catch (error: any) {
      this.logger.error('rollbackTransaction is running');
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };
}
