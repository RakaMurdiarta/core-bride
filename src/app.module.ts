import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './employee/employee.module';
import { envSchema } from '@env/env.schema';
import { EnvModule } from '@env/env.module';
import { LoggerModule } from '@logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbLiveConfig } from '@config/database/live.config';
import { EnvService } from '@env/env.service';
import { DataSource } from 'typeorm';
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
    EmployeeModule,
    EnvModule,
    LoggerModule,
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
  providers: [],
})
export class AppModule {}
