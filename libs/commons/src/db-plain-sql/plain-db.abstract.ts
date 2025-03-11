import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Logger, { LoggerKey } from '../logger/domain/logger';
import { Pool, PoolOptions, createPool } from 'mysql2/promise';
import { MODULE_OPTIONS_TOKEN } from './plain-db.module-defination';

export abstract class DBPlainContractService
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  constructor(
    @Inject(LoggerKey) protected logger: Logger,
    @Inject(MODULE_OPTIONS_TOKEN) private options: PoolOptions,
  ) {}

  async onModuleInit() {
    this.logger.info(
      `[${this.options.database}] >> Initializing MySQL pool...`,
    );

    try {
      this.pool = createPool(this.options);

      await this.checkConnection();

      this.logger.info(
        `[${this.options.database}] >> MySQL connection established successfully.`,
      );
    } catch (error) {
      this.logger.error(
        `[${this.options.database}] >> Failed to connect to MySQL: ${error.message}`,
        {
          props: {
            errors: error,
          },
        },
      );
      throw new Error(
        `[${this.options.database}] >> MySQL connection initialization failed`,
      );
    }
  }

  get connectionPool(): Pool {
    return this.pool;
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

  async onModuleDestroy() {
    this.logger.info('Closing MySQL pool...');
    await this.pool.end();
  }
}
