import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async del(key: string) {
    await this.cacheManager.del(key);
  }

  async get<T>(key: string) {
    await this.cacheManager.get<T>(key);
  }

  async reset() {
    await this.cacheManager.reset();
  }

  async set(key: string, value: unknown) {
    await this.cacheManager.set(key, value);
  }
}
