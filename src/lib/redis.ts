import Redis from "ioredis";

export let redis: Redis;

export async function connectRedis(): Promise<void> {
    redis = new Redis(process.env.REDIS_URL!);
    return new Promise((resolve, reject) => {
        redis.on('connect', () => {
            console.log('✅ Redis connected');
            resolve();
        });
        redis.on('error', (err) => { reject(err) });
    })
}