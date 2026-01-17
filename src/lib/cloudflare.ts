// src/lib/cloudflare.ts
import type { KVNamespace, D1Database } from "@cloudflare/workers-types";

export interface CloudflareEnv {
  MY_KV: KVNamespace;
  DB?: D1Database;
}

// 1. Move storage to a private variable in the module scope
const _storage = new Map<string, string>();

// 2. Define the mock using the external variable (no 'this' needed)
const localMockKV: KVNamespace = {
  get: async (key: string) => _storage.get(key) || null,
  put: async (key: string, value: string) => {
    _storage.set(key, value);
  },
  delete: async (key: string) => {
    _storage.delete(key);
  },
} as any;

async function getEnv(): Promise<CloudflareEnv | null> {
  if (typeof window !== "undefined") return null;

  try {
    // Attempting to load the virtual module
    const cf = await import("cloudflare:workers");
    return (cf as any).env as CloudflareEnv;
  } catch (error) {
    // Fallback for local Vite dev
    return {
      MY_KV: localMockKV,
    } as CloudflareEnv;
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
