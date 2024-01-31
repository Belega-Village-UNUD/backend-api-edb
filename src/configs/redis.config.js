const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

const redisEndpointUri = REDIS_ENDPOINT_URI
    ? REDIS_ENDPOINT_URI.replace(/^(redis\:\/\/)/, '')
    : `${REDIS_HOST}:${REDIS_PORT}`;

const redisClient = redis.createClient(`redis://${redisEndpointUri}`, {
	    password: REDIS_PASSWORD
});

module.exports = { redisEndpointUri, redisClient };

