import 'dotenv/config';
import Redis from 'ioredis';

const redisUri = process.env.REDIS_URI as string;

function redisClient() {
  if (redisUri) {
    return redisUri;
  }
  throw new Error('Redis URI not found');
}

export const redis = new Redis(redisClient());
