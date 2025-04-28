import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@env/env.schema';
import { EnvModule } from '@env/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbLiveConfig } from '@config/database/live.config';
import { EnvService } from '@env/env.service';
import { DataSource } from 'typeorm';
import { CommonsModule } from '@app/commons';
import { EmployeeModule } from './employee/employee.module';
import { ProjectModule } from './projects/project.module';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '@app/commons/infra/redis/redis.module';
import { BullModuleConfig } from '@app/commons/queue/redis-bull/redis-bull.conf';
import { ResponseApiInterceptor } from '@app/commons/interceptors/response-api.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JobModule } from './jobs/job.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    RedisModule,
    BullModuleConfig,
    CqrsModule.forRoot(),
    CommonsModule,
    EmployeeModule,
    ProjectModule,
    JobModule,
    TypeOrmModule.forRootAsync({
      useFactory: (env: EnvService) => {
        return {
          ...dbLiveConfig(env),
        };
      },
      dataSourceFactory: async (options) => {
        const logger = new Logger('Database Connection');
        try {
          const dataSource = await new DataSource(options).initialize();
          logger.log('Database Successfully Connected 🚀');
          return dataSource;
        } catch (error) {
          logger.error('Database Failed To Connect');
          throw error;
        }
      },
      imports: [EnvModule],
      inject: [EnvService],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseApiInterceptor,
    },
  ],
})
export class AppModule {}
