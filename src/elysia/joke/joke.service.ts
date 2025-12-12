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

  async getRandomJoke() {
    return handleAction("GetRandomJoke", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        ok: false,
        status: 503,
        error: "Joke API unreachable",
        message: "Failed to fetch joke from external API",
        toast: "Unable to load jokes right now 😢",
      };
    });
  }
}
