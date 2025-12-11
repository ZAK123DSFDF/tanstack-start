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
            const res = await fetch(
                "https://official-joke-api.appspot.com/random_joke",
            );
            if (!res.ok) {
                throwHttpError({
                    status: 503,
                    error: "Joke API unreachable",
                    toast: "Unable to load jokes right now 😢",
                    message: "Failed to fetch joke from external API",
                });
            }

            const data = await res.json();

            return {
                ok: true,
                status: 200,
                data: {
                    setup: data.setup,
                    punchline: data.punchline,
                },
            };
        });
    }
}