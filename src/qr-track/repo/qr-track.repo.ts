import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import Logger, { LoggerKey } from '@app/commons/logger/domain/logger';
import {
  QrTrackCreateProjectDto,
  qrTrackCreateProjectSchema,
} from '../zod-schema/qr-track.create-project.schema';
import { DBPlainContractService } from '@app/commons/db-plain-sql/plain-db.abstract';
import { MODULE_OPTIONS_TOKEN } from '@app/commons/db-plain-sql/plain-db.module-defination';
import { PoolConnection, PoolOptions } from 'mysql2/promise';

@Injectable()
export class QrTrackRepo extends DBPlainContractService {
  private insertStatment: string = 'INSERT INTO';
  private projectTable: string = 'projects';

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) options: PoolOptions,
    @Inject(LoggerKey) logger: Logger,
  ) {
    super(logger, options);
  }

  async createProject(
    payload: QrTrackCreateProjectDto,
    poolConnection: PoolConnection,
  ) {
    try {
      const columns = Object.keys(qrTrackCreateProjectSchema.shape)
        .filter((key) => key in payload)
        .concat(['created_at', 'updated_at']);

      const values: Array<any> = [];

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
}
