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

/* ---------- Elysia Instance ---------- */
const app = new Elysia({
  prefix: "/api",
  aot: false, // Required for Cloudflare
  adapter: CloudflareAdapter,
})
  .use(errorPlugin)
  .derive(({ request }) => {
    // We don't initialize env here anymore, we pass it in .fetch()
    return { url: request.url };
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
      .get("/random2", (ctx) => jokeControl.random2(ctx))
      .post("/success-demo", (ctx) => jokeControl.success(ctx))
      .post("/reset-demo", (ctx) => jokeControl.reset(ctx)),
  );

/* ---------- Handler for TanStack Start ---------- */
async function handle(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: CloudflareEnv };
  // Critical: Pass env as the second argument so ctx.env works in Elysia
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

/* ---------- Client Utilities ---------- */
export const api = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => {
    const url =
      process.env.NODE_ENV === "production"
        ? "https://my-elysia-tanstack-app.zekariyasberihun8.workers.dev"
        : "http://localhost:3000";
    return treaty<typeof app>(url).api;
  });
