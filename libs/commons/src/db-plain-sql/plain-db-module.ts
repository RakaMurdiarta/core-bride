import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './plain-db.module-defination';
import { DbPlainService } from './plain-db.service';
import { EnvModule } from '../config/env/env.module';

export const DBPOOL = Symbol('DBPOOL');

@Module({
  imports: [EnvModule],
  providers: [DbPlainService],
  exports: [DbPlainService],
})
export class DatabasePlainModule extends ConfigurableModuleClass {}
