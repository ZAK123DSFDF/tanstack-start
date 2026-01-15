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
const joke = new JokeController();
const app = new Elysia({
  prefix: "/api",
})
  .use(errorPlugin)
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
  .get("/joke/random2", joke.random2);

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
