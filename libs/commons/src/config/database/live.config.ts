import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbBaseConfig from './base-config';
import { EnvService } from '@env/env.service';
import * as entities from '@entities/index';
import { QueryDbLogger } from '@logger/query-db/db-query.logger';

export function dbLiveConfig(env: EnvService): TypeOrmModuleOptions {
  const config = {
    ...dbBaseConfig(env),
    type: 'postgres',
    synchronize: false,
    dropSchema: false,
    poolSize: 10,
    entities: Object.values(entities),
    logger: new QueryDbLogger(),
  } as TypeOrmModuleOptions;

  return config as TypeOrmModuleOptions;
}
