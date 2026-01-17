import { Elysia, t } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { treaty } from "@elysiajs/eden";
import { JokeController } from "@/elysia/joke/joke.controller";
import { errorPlugin } from "@/lib/elysia/error-plugin";
import { DEFAULT_JOKE_CATEGORY, JOKE_CATEGORIES } from "@/lib/constants/jokes";

const jokeControl = new JokeController();

/* ---------- Elysia Instance ---------- */
const app = new Elysia({
  prefix: "/api",
  aot: false,
  adapter: CloudflareAdapter,
})
  .use(errorPlugin)
  .get("/kv-test", async ({ env }: any) => {
    // 2. Access KV through the injected Elysia context
    const kv = env?.MY_KV;

    if (!kv) {
      return {
        success: false,
        error: "MY_KV not found in Elysia context",
        envKeys: env ? Object.keys(env) : "env is undefined",
      };
    }

    try {
      const testKey = "debug_check";
      const testValue = `Checked at ${new Date().toISOString()}`;
      await kv.put(testKey, testValue);
      const result = await kv.get(testKey);

      return {
        success: true,
        message: "KV Direct Import Success!",
        data: result,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  })
  .get("/status", () => ({
    ok: true,
    data: { status: "Operational", version: "2.0.26" },
  }))
  .group("/joke", (group) =>
    group
      .get("/random", (ctx) => jokeControl.random(ctx), {
        query: t.Object({
          query: t.Optional(t.String()),
          category: t.Optional(
            t.String({ default: DEFAULT_JOKE_CATEGORY, enum: JOKE_CATEGORIES }),
          ),
        }),
      })
      .get("/random2", () => jokeControl.random2())
      .post("/success-demo", () => jokeControl.success())
      .post("/reset-demo", () => jokeControl.reset())
      .post("/error-demo", () => jokeControl.error()),
  );

/* ---------- Handler ---------- */
async function handle(ctx: {
  request: Request;
  [key: string]: any;
}): Promise<Response> {
  const { request } = ctx;

  // 2. Dynamically get the environment
  let runtimeEnv: any;
  try {
    // This will work on Cloudflare but be ignored by Vite during build
    const cf = await import("cloudflare:workers");
    runtimeEnv = cf.env;
  } catch {
    // Fallback for local dev if needed
    runtimeEnv = ctx.env || {};
  }

  // 3. Pass it to Elysia
  return (app.fetch as any)(request, runtimeEnv);
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PATCH: handle,
      DELETE: handle,
      PUT: handle,
    },
  },
});

/* ---------- Client ---------- */
export const api = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => {
    const url =
      process.env.NODE_ENV === "production"
        ? "https://my-elysia-tanstack-app.zekariyasberihun8.workers.dev"
        : "http://localhost:3000";
    return treaty<typeof app>(url).api;
  });
