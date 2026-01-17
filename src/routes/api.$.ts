import { Elysia, t } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { treaty } from "@elysiajs/eden";
import { JokeController } from "@/elysia/joke/joke.controller";
import { errorPlugin } from "@/lib/elysia/error-plugin";
import { DEFAULT_JOKE_CATEGORY, JOKE_CATEGORIES } from "@/lib/constants/jokes";
import { CloudflareEnv } from "@/lib/types.ts";

const jokeControl = new JokeController();

const app = new Elysia({
  prefix: "/api",
  aot: false,
  adapter: CloudflareAdapter,
})
  .use(errorPlugin)
  .get("/kv-test", async ({ request, ...rest }) => {
    const env = (rest as any).env as CloudflareEnv;

    if (!env || !env.MY_KV) {
      return {
        success: false,
        error: "KV Binding 'MY_KV' not found",
        availableKeys: Object.keys(rest),
      };
    }

    try {
      const testValue = `Checked at ${new Date().toISOString()}`;
      await env.MY_KV.put("last_check", testValue);
      const retrieved = await env.MY_KV.get("last_check");

      return {
        success: true,
        message: "KV is working!",
        data: retrieved,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
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

async function handle(ctx: any): Promise<Response> {
  const { request } = ctx;
  const env = ctx.env || ctx.context?.cloudflare?.env || {};

  return (app.fetch as any)(request, env);
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

export const api = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => {
    const url =
      process.env.NODE_ENV === "production"
        ? "https://my-elysia-tanstack-app.zekariyasberihun8.workers.dev"
        : "http://localhost:3000";
    return treaty<typeof app>(url).api;
  });
