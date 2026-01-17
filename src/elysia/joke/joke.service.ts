// src/elysia/joke/joke.service.ts
import { throwHttpError } from "@/lib/elysia/throwHttpError";
import { handleAction } from "@/lib/elysia/hndleAction";

export class JokeService {
  // Simple in-memory state (Note: will reset when worker sleeps)
  private serverVersion = 1;

  async resetDemo() {
    return handleAction("ResetDemo", async () => {
      this.serverVersion = 1;
      return {
        ok: true,
        status: 200,
        toast: "Server state has been reset to Version 1",
        data: { version: 1 },
      };
    });
  }

  async successDemo() {
    return handleAction("SuccessDemo", async () => {
      this.serverVersion += 1;
      return {
        ok: true,
        status: 200,
        toast: `Server updated to version ${this.serverVersion}!`,
        data: { version: this.serverVersion },
      };
    });
  }

  async getRandomJoke(query?: string, category?: string) {
    return handleAction("GetRandomJoke", async () => {
      await new Promise((r) => setTimeout(r, 1500));
      const jokeText = query
        ? `[v${this.serverVersion}] Search result: "${query}"`
        : `[v${this.serverVersion}] Why don't scientists trust atoms?`;

      return {
        ok: true,
        status: 200,
        data: { message: jokeText, category: category || "general" },
      };
    });
  }

  async getSlowJoke() {
    return handleAction("GetSlowJoke", async () => {
      await new Promise((r) => setTimeout(r, 4000));
      return {
        ok: true,
        status: 200,
        data: { message: `[v${this.serverVersion}] Static slow joke content.` },
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
