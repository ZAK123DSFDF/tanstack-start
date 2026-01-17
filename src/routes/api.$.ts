import { Elysia, t } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { treaty } from "@elysiajs/eden";
import { JokeController } from "@/elysia/joke/joke.controller";
import { errorPlugin } from "@/lib/elysia/error-plugin";
import { DEFAULT_JOKE_CATEGORY, JOKE_CATEGORIES } from "@/lib/constants/jokes";

const jokeControl = new JokeController();

const app = new Elysia({
  prefix: "/api",
  aot: false,
  adapter: CloudflareAdapter,
})
  .use(errorPlugin)
  .get("/kv-test", async (ctx) => {
    const env = (ctx as any).env;
    return {
      success: false,
      message: "Diagnostic Mode",
      hasEnvObject: !!env,
      hasMyKV: !!env?.MY_KV,
      allContextKeys: Object.keys(ctx),
      requestHasEnv: !!(ctx.request as any).env,
    };
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

async function handle(ctx: {
  request: Request;
  [key: string]: any;
}): Promise<Response> {
  const { request } = ctx;
  console.log("--- Production Context Scan ---");
  console.log("Top-level keys:", Object.keys(ctx));
  const env =
    ctx.env ||
    ctx.context?.cloudflare?.env ||
    (request as any).env ||
    (globalThis as any).process?.env ||
    (globalThis as any).MY_KV
      ? globalThis
      : {};
  console.log("Discovery Results:", {
    hasEnv: !!env,
    hasMyKV: !!(env && (env as any).MY_KV),
    envKeys: env ? Object.keys(env) : [],
    isGlobalKV: !!(globalThis as any).MY_KV,
  });
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
