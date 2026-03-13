// backend/config/redis.js

import { createClient } from "redis";

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    });

    redisClient.on("error", (err) => {
      console.log("Redis error:", err.message);
    });

    await redisClient.connect();
    console.log("✅ Redis Connected");

  } catch (error) {
    console.log("⚠️ Redis not connected, continuing without cache");
    redisClient = null;
  }
};

export { redisClient };
export default connectRedis;