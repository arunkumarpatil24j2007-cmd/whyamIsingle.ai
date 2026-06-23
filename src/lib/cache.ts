import Redis from 'ioredis';

let redisClient: Redis | null = null;
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

const hasRedisUrl = !!process.env.REDIS_URL && process.env.REDIS_URL !== 'mock';

if (hasRedisUrl) {
  try {
    redisClient = new Redis(process.env.REDIS_URL!);
    redisClient.on('error', (err) => {
      console.warn('Redis connection error, falling back to memory cache:', err);
    });
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
  }
}

export async function getCache(key: string): Promise<string | null> {
  // If Redis client is active, try to fetch from Redis
  if (redisClient) {
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.warn('Redis get failed, checking memory cache:', error);
    }
  }

  // Fallback to Memory Cache
  const cached = memoryCache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return cached.value;
}

export async function setCache(key: string, value: string, ttlSeconds = 3600): Promise<void> {
  // If Redis client is active, set to Redis
  if (redisClient) {
    try {
      await redisClient.set(key, value, 'EX', ttlSeconds);
      return;
    } catch (error) {
      console.warn('Redis set failed, falling back to memory cache:', error);
    }
  }

  // Fallback to Memory Cache
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}
