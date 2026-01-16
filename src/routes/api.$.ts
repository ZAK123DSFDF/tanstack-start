import { Elysia, t } from "elysia";
import { treaty } from "@elysiajs/eden";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { JokeController } from "@/elysia/joke/joke.controller.ts";
import { errorPlugin } from "@/lib/elysia/error-plugin.ts";
import {
  DEFAULT_JOKE_CATEGORY,
  JOKE_CATEGORIES,
} from "@/lib/constants/jokes.ts";
import { throwHttpError } from "@/lib/elysia/throwHttpError.ts";
const joke = new JokeController();
export class GlobalService {
  async getSystemStatus() {
    await new Promise((resolve) => setTimeout(resolve, 200));
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
const app = new Elysia({
  prefix: "/api",
})
  .use(errorPlugin)
  .get("/status", () => globalService.getSystemStatus())
  .get("/joke/random", joke.random, {
    query: t.Object({
      query: t.Optional(t.String()),
      category: t.Optional(
        t.String({
          default: DEFAULT_JOKE_CATEGORY,
          enum: JOKE_CATEGORIES, // 👈 Shared array
        }),
      ),
    }),
  })
  .get("/joke/random2", joke.random2)
  .post("/joke/success-demo", joke.success)
  .post("/joke/error-demo", joke.error)
  .post("/joke/reset-demo", joke.reset);

const handle = ({ request }: { request: Request }) => app.fetch(request);

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
  .client(() => treaty<typeof app>("localhost:3000").api);
