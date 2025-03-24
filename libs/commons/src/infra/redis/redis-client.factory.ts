import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { EnvService } from '@env/env.service';
import Logger, { LoggerKey } from '@logger/domain/logger';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: (env: EnvService, logger: Logger) => {
    try {
      const redisInstance = new Redis({
        host: env.get('REDIS_HOST'),
        port: +env.get('REDIS_PORT'),
      });

      redisInstance.on('connect', () => {
        logger.info('Redis Client Successfully was create', {
          sourceClass: 'REDIS CLIENT',
        });
      });

      redisInstance.on('error', (e) => {
        logger.info('Redis connection failed', {
          error: e,
          sourceClass: 'REDIS CLIENT',
        });

        throw new Error(`Redis connection failed: ${e}`);
      });

      return redisInstance;
    } catch (error) {
      throw error;
    }
  },
  inject: [EnvService, LoggerKey],
};
