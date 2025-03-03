import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbBaseConfig from './base-config';
import { EnvService } from '../env/env.service';

export function dbLiveConfig(env: EnvService): TypeOrmModuleOptions {
  const config = {
    type: 'postgres',
    ...dbBaseConfig(env),
    synchronize: false,
  };

  return config as TypeOrmModuleOptions;
}
