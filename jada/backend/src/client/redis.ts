import { createClient } from "redis";
import { RedisClientType } from "redis";
import CONSTANT from "../config/const.config";
import { createErrorObject } from "../utils/error.utils";
import { ERROR } from "../config/error.constant";

export default class RedisClient {
  public client: RedisClientType;
  private static instance: RedisClient;
  private port = CONSTANT.REDIS_PORT;
  private host = CONSTANT.REDIS_HOST;
  private password = CONSTANT.REDIS_PASSWORD;

  private constructor() {
    const url = `redis://${this.host}:${this.port}`;
    this.client = createClient({
      url,
      password: this.password || undefined,
    });
    
    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
      throw createErrorObject(ERROR.DEFAULT);
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async set(
    key: string,
    value: string,
    expiryInSeconds?: number
  ): Promise<void> {
    if (expiryInSeconds) {
      await this.client.setEx(key, expiryInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }
}