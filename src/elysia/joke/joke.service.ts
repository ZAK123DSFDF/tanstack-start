// src/elysia/joke/joke.service.ts
import { throwHttpError } from "@/lib/elysia/throwHttpError";
import { handleAction } from "@/lib/elysia/hndleAction";
import { getKV } from "@/lib/cloudflare.ts";

export class JokeService {
  private KV_KEY = "server_version";

  async resetDemo() {
    return handleAction("ResetDemo", async () => {
      const kv = await getKV();
      if (kv) await kv.put(this.KV_KEY, "1");

      return {
        ok: true,
        status: 200,
        toast: "KV state has been reset to Version 1",
        data: { version: 1 },
      };
    });
  }

  async successDemo() {
    return handleAction("SuccessDemo", async () => {
      const kv = await getKV();
      let currentVersion = 1;

      if (kv) {
        const stored = await kv.get(this.KV_KEY);
        currentVersion = stored ? parseInt(stored) + 1 : 2;
        await kv.put(this.KV_KEY, currentVersion.toString());
      }

      return {
        ok: true,
        status: 200,
        toast: `KV updated to version ${currentVersion}!`,
        data: { version: currentVersion },
      };
    });
  }

  async getRandomJoke(query?: string, category?: string) {
    return handleAction("GetRandomJoke", async () => {
      const kv = await getKV();
      const version = (await kv?.get(this.KV_KEY)) || "1";

      await new Promise((r) => setTimeout(r, 1000));

      const jokeText = query
        ? `[KV v${version}] Search result: "${query}"`
        : `[KV v${version}] Why did the developer stay at the office? Because they couldn't find the 'exit' node.`;

      return {
        ok: true,
        status: 200,
        data: { message: jokeText, category: category || "general" },
      };
    });
  }

  async getSlowJoke() {
    return handleAction("GetSlowJoke", async () => {
      const kv = await getKV();
      const version = (await kv?.get(this.KV_KEY)) || "1";

      await new Promise((r) => setTimeout(r, 2000));
      return {
        ok: true,
        status: 200,
        data: {
          message: `[KV v${version}] Static slow joke from edge storage.`,
        },
      };
    });
  }

  async errorDemo() {
    return handleAction("ErrorDemo", async () => {
      throw throwHttpError({
        status: 400,
        error: "DemoError",
        toast: "Intentional error!",
        message: "Something went wrong.",
      });
    });
  }
}
