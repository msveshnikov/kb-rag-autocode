import { promisify } from "util";
import redis from "redis";

export class PromptCache {
    constructor() {
        this.client = redis.createClient({
            url: process.env.REDIS_URL,
        });

        this.client.on("error", (err) => console.error("Redis Client Error", err));

        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.expireAsync = promisify(this.client.expire).bind(this.client);
    }

    async connect() {
        await this.client.connect();
    }

    async get(key) {
        try {
            return await this.getAsync(key);
        } catch (error) {
            console.error("Error getting cached prompt:", error);
            return null;
        }
    }

    async set(key, value, expirationInSeconds = 3600) {
        try {
            await this.setAsync(key, value);
            await this.expireAsync(key, expirationInSeconds);
        } catch (error) {
            console.error("Error setting cached prompt:", error);
        }
    }

    async close() {
        await this.client.quit();
    }
}
