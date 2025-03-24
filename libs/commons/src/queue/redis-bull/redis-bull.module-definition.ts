import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IRedisBullQueue } from './Iredis-bull-queue';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<IRedisBullQueue>().build();
