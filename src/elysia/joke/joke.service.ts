import { throwHttpError } from "@/lib/elysia/throwHttpError";
import { handleAction } from "@/lib/elysia/hndleAction";

export class JokeService {
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
      return {
        ok: true,
        status: 200,
        data: {
          message: "This is a successful action!",
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

      const shouldError = false;
      if (shouldError) {
        throw throwHttpError({
          status: 500,
          error: "DatabaseError",
          message: "The joke database is currently offline.",
          toast: "Could not fetch jokes 😢",
        });
      }

      // Logic using the query and category
      const jokeText = query
        ? `Here is a ${category || "general"} joke about "${query}": Why did the ${query} cross the road?`
        : "Why don't scientists trust atoms? Because they make up everything!";

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
      await new Promise((resolve) => setTimeout(resolve, 4000)); // 4 seconds!
      return {
        ok: true,
        status: 200,
        data: {
          message: "I am a very slow joke that doesn't care about your search.",
        },
      };
    });
  }
}
