import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import Logger, { LoggerKey } from '@app/commons/logger/domain/logger';
import {
  SiaCreateProjectDto,
  siaCreateProjectSchema,
} from '../zod-schema/sia.create-project.schema';
import { MODULE_OPTIONS_TOKEN } from '@app/commons/db-plain-sql/plain-db.module-defination';
import { PoolConnection, PoolOptions } from 'mysql2/promise';
import { DBPlainContractService } from '@app/commons/db-plain-sql/plain-db.abstract';

@Injectable()
export class SiaRepo extends DBPlainContractService {
  private insertStatment: string = 'INSERT INTO';
  private projectTable: string = 'projects';

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) options: PoolOptions,
    @Inject(LoggerKey) logger: Logger,
  ) {
    super(logger, options);
  }

  async createProject(
    payload: SiaCreateProjectDto,
    poolConnection: PoolConnection,
  ) {
    try {
      const columns = Object.keys(siaCreateProjectSchema.shape).filter(
        (key) => key in payload,
      );

      const parameterized = columns.map(() => '?').join(', ');

      const sql = `${this.insertStatment} ${this.projectTable}(${columns.join(', ')}) VALUES (${parameterized})`;

      const values = columns.map((column) => payload[column] || null);

      await poolConnection.execute(sql, values);
    } catch (error) {
      this.logger.error(error.message, {
        props: payload,
      });
      throw new UnprocessableEntityException('Failed to create project');
    }
  }
}
