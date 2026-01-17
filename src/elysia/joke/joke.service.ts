import { throwHttpError } from "@/lib/elysia/throwHttpError";
import { handleAction } from "@/lib/elysia/hndleAction";
import { CloudflareEnv } from "@/lib/types.ts";

export class JokeService {
  private async getVersion(env: CloudflareEnv): Promise<number> {
    const v = await env.MY_KV.get("server_version");
    return v ? parseInt(v) : 1;
  }
  async resetDemo(env: CloudflareEnv) {
    return handleAction("ResetDemo", async () => {
      await env.MY_KV.put("server_version", "1");
      return {
        ok: true,
        status: 200,
        toast: "Reset to Version 1",
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
  async successDemo(env: CloudflareEnv) {
    return handleAction("SuccessDemo", async () => {
      const current = await this.getVersion(env);
      const next = current + 1;
      await env.MY_KV.put("server_version", next.toString());
      return {
        ok: true,
        status: 200,
        toast: `Updated to v${next}`,
        data: { version: next },
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

  async getRandomJoke(env: CloudflareEnv, query?: string, category?: string) {
    return handleAction("GetRandomJoke", async () => {
      const [v] = await Promise.all([
        this.getVersion(env),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
      const jokeText = query
        ? `[v${v}] Search: ${query}`
        : `[v${v}] Why don't atoms trust scientists?`;
      return {
        ok: true,
        status: 200,
        data: { message: jokeText, category: category || "general" },
      };
    });
  }
  async getSlowJoke(env: CloudflareEnv) {
    return handleAction("GetSlowJoke", async () => {
      const [v] = await Promise.all([
        this.getVersion(env),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]);

      return {
        ok: true,
        status: 200,
        data: {
          message: `[Server v${v}] This joke took 4 seconds to travel from the edge.`,
        },
      };
    });
  }
}
