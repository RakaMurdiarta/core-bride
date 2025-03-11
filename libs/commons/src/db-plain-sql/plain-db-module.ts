import { Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './plain-db.module-defination';
import { EnvModule } from '../config/env/env.module';
import { PoolOptions } from 'mysql2/promise';

export const DBPOOL = Symbol('DBPOOL');

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: MODULE_OPTIONS_TOKEN,
      useFactory: (options: PoolOptions) => {
        return options;
      },
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [MODULE_OPTIONS_TOKEN],
})
export class DatabasePlainModule extends ConfigurableModuleClass {}
