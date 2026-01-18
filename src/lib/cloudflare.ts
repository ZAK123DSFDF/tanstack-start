// src/lib/cloudflare.ts
import type { KVNamespace, D1Database } from "@cloudflare/workers-types";
import { Redis } from "@upstash/redis/cloudflare";
export interface CloudflareEnv {
  MY_KV: KVNamespace;
  DB?: D1Database;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

// 1. Local Mock Storage
const _storage = new Map<string, string>();

const localMockKV = {
  get: async (key: string) => _storage.get(key) || null,
  put: async (key: string, value: string) => {
    _storage.set(key, value);
  },
  delete: async (key: string) => {
    _storage.delete(key);
  },
  // Add other KV methods as needed for types
} as unknown as KVNamespace;

/**
 * Environment Switcher
 */
async function getEnv(): Promise<CloudflareEnv | null> {
  // 1. Safety check for Browser
  if (typeof window !== "undefined") return null;

  // 2. Choose method based on environment
  if (process.env.NODE_ENV === "development") {
    // Locally, return the mock immediately.
    // Vite will never try to resolve the import below.
    return {
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      MY_KV: localMockKV,
    } as CloudflareEnv;
  } else {
    try {
      // Production (Cloudflare Worker runtime)
      const cf = await import("cloudflare:workers");
      return cf.env as CloudflareEnv;
    } catch (e) {
      console.error("Failed to load Cloudflare Workers env", e);
      return {
        MY_KV: localMockKV,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      } as CloudflareEnv;
    }
  }
}

export async function getKV() {
  const env = await getEnv();
  return env?.MY_KV ?? null;
}

export async function getDB() {
  const env = await getEnv();
  return env?.DB ?? null;
}
let redisClient: Redis | null = null;

export const getRedis = async () => {
  if (redisClient) return redisClient;
  const env = await getEnv();

  const url = env?.UPSTASH_REDIS_REST_URL;
  const token = env?.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "❌ Redis credentials missing! Ensure UPSTASH_REDIS_REST_URL and TOKEN are set in your .env or Wrangler config.",
    );
  }

  redisClient = new Redis({
    url: url,
    token: token,
  });

  return redisClient;
};
