import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis-client.factory';
import { CommonsModule } from '@app/commons/commons.module';

@Module({
  imports: [CommonsModule],
  providers: [redisClientFactory],
})
export class RedisModule {}
