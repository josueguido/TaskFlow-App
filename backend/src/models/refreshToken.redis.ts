import { invalidatePattern, redis } from '../config/redis';
import crypto from 'crypto';

const TTL = 60 * 60 * 24 * 7;
const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const saveRefreshToken = async (userId: number, token: string): Promise<void> => {
  const key = `rt:${userId}:${hashToken(token)}`;
  await redis.set(key, token, 'EX', TTL);
};

export const findRefreshToken = async (token: string, userId: number): Promise<string | null> => {
  const key = `rt:${userId}:${hashToken(token)}`;
  const value = await redis.get(key);
  return value;
};

export const deleteRefreshToken = async (token: string, userId: number): Promise<void> => {
  const key = `rt:${userId}:${hashToken(token)}`;
  await redis.del(key);
};

export const deleteAllUserTokens = async (userId: number): Promise<void> => {
  await invalidatePattern(`rt:${userId}:*`);
};
