import Redis from "ioredis";

export let redis: Redis;

export async function connectRedis(): Promise<void> {
    redis = new Redis({ host: process.env.HOST!, port: Number(process.env.REDIS_PORT!) });
    return new Promise((resolve, reject) => {
        redis.on('connect', () => {
            console.log('✅ Redis connected');
            resolve();
        });
        redis.on('error', (err) => { reject(err) });
    })
}