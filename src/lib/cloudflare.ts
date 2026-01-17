// src/lib/cloudflare.ts
import type { KVNamespace, D1Database } from "@cloudflare/workers-types";

export interface CloudflareEnv {
  MY_KV: KVNamespace;
  DB?: D1Database; // Optional, in case you haven't added it yet
}

/**
 * Internal helper to get the raw environment object with types.
 */
async function getEnv(): Promise<CloudflareEnv | null> {
  try {
    // Safety check for browser execution
    if (typeof window !== "undefined") return null;

    // Dynamically import the virtual module
    const cf = await import("cloudflare:workers");

    // Cast to our known interface
    return cf.env as CloudflareEnv;
  } catch (error) {
    console.error("Cloudflare environment access failed:", error);
    return null;
  }
}

/**
 * Reusable helper for KV access
 */
export async function getKV(): Promise<KVNamespace | null> {
  const env = await getEnv();
  return env?.MY_KV ?? null;
}

/**
 * Reusable helper for D1 Database access
 */
export async function getDB(): Promise<D1Database | null> {
  const env = await getEnv();
  return env?.DB ?? null;
}
