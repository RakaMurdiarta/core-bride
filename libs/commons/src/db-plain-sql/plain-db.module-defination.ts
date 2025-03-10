import { ConfigurableModuleBuilder } from '@nestjs/common';
import { PoolOptions } from 'mysql2/promise';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PoolOptions>().build();
