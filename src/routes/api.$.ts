// src/routes/api.$.ts
import { Elysia, t } from "elysia";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { treaty } from "@elysiajs/eden";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { JokeController } from "@/elysia/joke/joke.controller.ts";
import { errorPlugin } from "@/lib/elysia/error-plugin.ts";
import {
  DEFAULT_JOKE_CATEGORY,
  JOKE_CATEGORIES,
} from "@/lib/constants/jokes.ts";
import { throwHttpError } from "@/lib/elysia/throwHttpError.ts";

const joke = new JokeController();

class GlobalService {
  async getSystemStatus() {
    await new Promise((r) => setTimeout(r, 200));
    const success = true;
    if (!success) {
      throw throwHttpError({
        status: 400,
        error: "DemoError",
        toast: "This is an intentional error!",
        message: "Something went wrong in the demo error endpoint.",
      });
    }
    return {
      ok: true,
      data: {
        status: "All systems operational",
        version: "2.0.26",
        maintenance: false,
      },
    };
  }
}
const globalService = new GlobalService();

/* ---------- Elysia app ---------- */
const app = new Elysia({
  prefix: "/api",
  adapter: CloudflareAdapter,
})
  .use(errorPlugin)
  .derive(({ request }) => {
    console.log(`[${request.method}] ${request.url}`);
    return {
      env: {} as CloudflareEnv,
    };
  })
  .get("/kv-check", async ({ env }) => {
    // If our 'handle' passed env correctly, this will work
    if (!env?.MY_KV) {
      return { error: "KV Binding not found in env" };
    }

    await env.MY_KV.put("test-key", "It works!");
    const value = await env.MY_KV.get("test-key");

    return {
      status: "Success",
      retrievedValue: value,
    };
  })
  .get("/status", () => globalService.getSystemStatus())
  .get("/joke/random", joke.random, {
    query: t.Object({
      query: t.Optional(t.String()),
      category: t.Optional(
        t.String({ default: DEFAULT_JOKE_CATEGORY, enum: JOKE_CATEGORIES }),
      ),
    }),
  })
  .get("/joke/random2", joke.random2)
  .post("/joke/success-demo", joke.success)
  .post("/joke/error-demo", joke.error)
  .post("/joke/reset-demo", joke.reset);
interface CloudflareEnv {
  MY_KV: KVNamespace;
}
async function handle(ctx: any): Promise<Response> {
  // TanStack Start provides 'request' and 'env' in the context
  const { request, env } = ctx as { request: Request; env: CloudflareEnv };

  // We MUST pass 'env' into app.fetch so Elysia's derive() can see it
  return (app.fetch as any)(request, env);
}

/* ---------- TanStack‑Start route ---------- */
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
      process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

    return treaty<typeof app>(url).api;
  });
