const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

const getCache = async (key) => {
    try {
        const client = getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        logger.warn(`Cache get error for key ${key}: ${err.message}`);
        return null;
    }
};

const setCache = async (key, value, ttl = 300) => {
    try {
        const client = getRedisClient();
        await client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (err) {
        logger.warn(`Cache set error for key ${key}: ${err.message}`);
    }
};

const deleteCache = async (key) => {
    try {
        const client = getRedisClient();
        await client.del(key);
    } catch (err) {
        logger.warn(`Cache delete error for key ${key}: ${err.message}`);
    }
};

const deleteCacheByPattern = async (pattern) => {
    try {
        const client = getRedisClient();
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(...keys);
        }
    } catch (err) {
        logger.warn(`Cache pattern delete error for ${pattern}: ${err.message}`);
    }
};

module.exports = { getCache, setCache, deleteCache, deleteCacheByPattern };
