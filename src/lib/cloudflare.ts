// src/lib/cloudflare.ts
import type { KVNamespace, D1Database } from "@cloudflare/workers-types";

export interface CloudflareEnv {
  MY_KV: KVNamespace;
  DB?: D1Database;
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
      MY_KV: localMockKV,
    } as CloudflareEnv;
  } else {
    try {
      // Production (Cloudflare Worker runtime)
      const cf = await import("cloudflare:workers");
      return cf.env as CloudflareEnv;
    } catch (e) {
      console.error("Failed to load Cloudflare Workers env", e);
      return { MY_KV: localMockKV } as CloudflareEnv;
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
