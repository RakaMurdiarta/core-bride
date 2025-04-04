import { BullModule } from '@nestjs/bullmq';
import { EnvService } from '@env/env.service';
import Logger, { LoggerKey } from '@logger/domain/logger';
import { QueueOptions } from 'bullmq';
import { CommonsModule } from '@app/commons/commons.module';

export const BullModuleConfig = BullModule.forRootAsync({
  imports: [CommonsModule],
  useFactory: (env: EnvService, logger: Logger) => {
    try {
      const connection: QueueOptions = {
        connection: {
          host: env.get('REDIS_HOST'),
          port: env.get('REDIS_PORT'),
        },
        defaultJobOptions: {
          removeOnComplete: 1000,
          removeOnFail: 5000,
          attempts: 3,
        },
      };
      return connection;
    } catch (error) {
      logger.error('failed to connect redis on redis-bullmq configuration');
      throw error;
    }
  },
  inject: [EnvService, LoggerKey],
});
