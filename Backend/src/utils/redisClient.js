import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Redis Client Connected Successfully");
    } catch (err) {
        console.error("Failed to Connect to Redis", err);
    }
}

async function disconnectRedis() {
    try {
        await redisClient.quit();
        console.log("Redis Client Disconnected Successfully");
    } catch (err) {
        console.error("Failed to Disconnect from Redis", err);
    }
}

connectRedis();

process.on("SIGINT", async () => {
    await disconnectRedis();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await disconnectRedis();
    process.exit(0);
});

export default redisClient;
