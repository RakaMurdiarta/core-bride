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
import { PoolConnection, PoolOptions, QueryResult } from 'mysql2/promise';
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
      const columns = Object.keys(siaCreateProjectSchema.shape)
        .filter((key) => key in payload)
        .concat(['created_at', 'updated_at']);

      const values: Array<unknown> = [];

      const mysqlFormattedDate = new Date()
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .split('.')[0];

      columns.forEach((column) => {
        if (column === 'created_at' || column === 'updated_at') {
          values.push(mysqlFormattedDate);
        } else {
          values.push(payload[column] ?? null);
        }
      });

      const parameterized = columns.map(() => '?').join(', ');

      const sql = `${this.insertStatment} ${this.projectTable}(${columns.join(', ')}) VALUES (${parameterized})`;

      await poolConnection.execute(sql, values);
    } catch (error) {
      this.logger.error(error.message, {
        props: payload,
      });
      throw new UnprocessableEntityException('Failed to create project');
    }
  }

  async findById(
    payload: { projectId: number },
    poolConnection: PoolConnection,
  ): Promise<{ ProjectID: number } | null> {
    try {
      const columns = ['ProjectID'].join(',');
      const sql = `SELECT ${columns} FROM projects WHERE ProjectID = ? AND deleted_at IS NULL`;

      const row = await poolConnection.execute<SelectResult>(sql, [
        payload.projectId,
      ]);

      let result: { ProjectID: number } | null = null;

      if (row.length <= 0) {
        return null;
      }

      row[0].forEach((e) => {
        result = e;
      });

      return result;
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }
}

type SelectResult = QueryResult & Array<{ ProjectID: number }>;
