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
  .get("/status", async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      ok: true,
      data: { status: "Operational", version: "2.1.26" },
    };
  })
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
  )
  .group("/redis", (group) =>
    group
      .get("/", () => jokeControl.getRedis())
      .post("/", ({ body }) => jokeControl.setRedis({ body }), {
        body: t.Object({
          value: t.String({ minLength: 1 }),
        }),
      })
      .delete("/", () => jokeControl.deleteRedis()),
  );

/* ---------- Handler ---------- */
async function handle(ctx: { request: Request }): Promise<Response> {
  return (app.fetch as any)(ctx.request);
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
