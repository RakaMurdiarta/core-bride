import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './plain-db.module-defination';
import { Pool, createPool, PoolOptions } from 'mysql2/promise';
import Logger, { LoggerKey } from '../logger/domain/logger';

@Injectable()
export class DbPlainService implements OnModuleDestroy, OnModuleInit {
  private pool: Pool;

  constructor(
    @Inject(LoggerKey) private logger: Logger,
    @Inject(MODULE_OPTIONS_TOKEN) private options: PoolOptions,
  ) {}

  async onModuleInit() {
    this.logger.info('Initializing MySQL pool...');

    try {
      this.pool = createPool(this.options);

      await this.checkConnection();

      this.logger.info('MySQL connection established successfully.');
    } catch (error) {
      this.logger.error('Failed to connect to MySQL:', error.message);
      throw new Error('MySQL connection initialization failed');
    }
  }

  private async checkConnection(): Promise<void> {
    try {
      const [rows] = await this.pool.query('SELECT 1');
      if (!rows) {
        throw new Error('Failed to verify connection');
      }
    } catch (error) {
      throw new Error('MySQL connection test failed: ' + error.message);
    }
  }

  get connectionPool(): Pool {
    return this.pool;
  }

  async query(sql: string, values?: Array<any>) {
    const [rows] = await this.pool.execute(sql, values);
    return rows;
  }

  async onModuleDestroy() {
    this.logger.info('Closing MySQL pool...');
    await this.pool.end();
  }
}
