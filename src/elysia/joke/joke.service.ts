import { throwHttpError } from "@/lib/elysia/throwHttpError";
import { handleAction } from "@/lib/elysia/hndleAction";

export class JokeService {
  private serverVersion = 1;
  async resetDemo() {
    return handleAction("ResetDemo", async () => {
      this.serverVersion = 1; // 🟢 Reset the "Database"

      return {
        ok: true,
        status: 200,
        toast: "Server state has been reset to Version 1",
        data: { version: 1 },
      };
    });
  }
  async redirectToDemo() {
    return handleAction("RedirectToDemo", async () => {
      return {
        ok: true,
        status: 200,
        data: {
          redirectUrl: "/redirected",
        },
      };
    });
  }
  async successDemo() {
    return handleAction("SuccessDemo", async () => {
      // 🚀 Simulate an update to the database
      this.serverVersion += 1;

      return {
        ok: true,
        status: 200,
        toast: `Server updated to version ${this.serverVersion}!`,
        data: {
          version: this.serverVersion,
        },
      };
    });
  }

  async errorDemo() {
    return handleAction("ErrorDemo", async () => {
      throw throwHttpError({
        status: 400,
        error: "DemoError",
        toast: "This is an intentional error!",
        message: "Something went wrong in the demo error endpoint.",
      });
    });
  }

  async getRandomJoke(query?: string, category?: string) {
    return handleAction("GetRandomJoke", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 🟢 Use the serverVersion instead of a random number
      const jokeText = query
        ? `[Server v${this.serverVersion}] Search result for "${query}"`
        : `[Server v${this.serverVersion}] Why don't scientists trust atoms?`;

      return {
        ok: true,
        status: 200,
        data: {
          message: jokeText,
          category: category || "general",
        },
      };
    });
  }

  async getSlowJoke() {
    return handleAction("GetSlowJoke", async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));

      return {
        ok: true,
        status: 200,
        data: {
          // 🟢 Reflect the same global version
          message: `[Server v${this.serverVersion}] Static slow joke content.`,
        },
      };
    });
  }
}
