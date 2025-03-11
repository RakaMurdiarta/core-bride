import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DbPlainService } from '@app/commons/db-plain-sql/plain-db.service';
import Logger, { LoggerKey } from '@app/commons/logger/domain/logger';
import {
  QrTrackCreateProjectDto,
  qrTrackCreateProjectSchema,
} from '../zod-schema/qr-track.create-project.schema';

@Injectable()
export class QrTrackRepo {
  private insertStatment: string = 'INSERT INTO';
  private projectTable: string = 'projects';

  constructor(
    private dbPlainService: DbPlainService,
    @Inject(LoggerKey) private logger: Logger,
  ) {}

  async createProject(payload: QrTrackCreateProjectDto) {
    try {
      const columns = Object.keys(qrTrackCreateProjectSchema.shape).filter(
        (key) => key in payload,
      );

      const parameterized = columns.map(() => '?').join(', ');

      const sql = `${this.insertStatment} ${this.projectTable}(${columns.join(', ')}) VALUES (${parameterized})`;

      const values = columns.map((column) => payload[column] || null);

      await this.dbPlainService.query(sql, values);
    } catch (error) {
      this.logger.error(error.message, {
        props: payload,
      });
      throw new UnprocessableEntityException('Failed to create project');
    }
  }
}
