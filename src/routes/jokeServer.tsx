import { createFileRoute } from "@tanstack/react-router";
import {JokeData} from "@/components/JokeData.tsx";
import {api} from "@/routes/api.$.ts";
import {createServerFn} from "@tanstack/react-start";

export const fetchJoke1 = createServerFn().handler(async () => {
    const result = await api().joke.random.get();

    return result.data; // <-- Only JSON serializable value
});

export const fetchJoke2 = createServerFn().handler(async () => {
    const result = await api().joke.random2.get();

    return result.data;
});
export const Route = createFileRoute("/jokeServer")({
    loader: () => ({
        joke1: fetchJoke1(),
        joke2: fetchJoke2(),
    }),
    component: JokePage,

});

// -----------------------------
// 3️⃣ Page component (FIXED: Accessing data from useLoader())
// -----------------------------
function JokePage() {
    // 🔑 FIX 3: When the loader is NOT returning promises, useLoader returns the resolved data directly.
    // The router automatically waits for the loader to finish before rendering the component.


    // Since the loader has already completed successfully, we don't check for isLoading or error here.
    // The data is guaranteed to be the resolved joke string.

    return (
        <div style={{ padding: "20px" }}>
            <h1>Random Joke</h1>

            {/* This UI is rendered ONLY after the loader (and getJoke()) succeeds */}
            <JokeData/>
        </div>
    );
}
