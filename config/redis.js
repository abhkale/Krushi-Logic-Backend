const Redis = require('ioredis');
const logger = require('../utils/logger');

let client = null;

const getRedisClient = () => {
    if (!client) {
        client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            db: parseInt(process.env.REDIS_DB) || 0,
            retryStrategy: (times) => {
                if (times > 3) {
                    logger.warn('Redis connection failed. Cache disabled.');
                    return null;
                }
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });

        client.on('connect', () => logger.info('Redis connected'));
        client.on('error', (err) => logger.warn(`Redis error: ${err.message}`));
        client.on('close', () => logger.warn('Redis connection closed'));
    }
    return client;
};

module.exports = { getRedisClient };
