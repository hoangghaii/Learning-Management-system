import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { RedisCacheService } from './redis-cache.service';

@Module({
  exports: [RedisCacheService],
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
    }),
  ],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
