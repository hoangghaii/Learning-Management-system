import { redis } from '@/libs/redis';

export const getUserById = async (id: string) => {
  try {
    const user = await redis.get(id);

    if (user) return JSON.parse(user);
  } catch (error: any) {
    return error;
  }
};
