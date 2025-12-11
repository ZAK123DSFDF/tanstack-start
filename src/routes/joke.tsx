import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

// -----------------------------
// 1️⃣ Server function to fetch joke with 2s delay
// -----------------------------
export const getJoke = createServerFn().handler(async () => {
    await new Promise((r) => setTimeout(r, 2000));

    const res = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
    if (!res.ok) throw new Error("Failed to fetch joke");

    const data = await res.json();
    return data.joke;
});

// -----------------------------
// 2️⃣ Route definition (no loader needed)
// -----------------------------
export const Route = createFileRoute("/joke")({
    component: JokePage,
});

// -----------------------------
// 3️⃣ Page component using classic useQuery
// -----------------------------
function JokePage() {
    const jokeQuery = useQuery({
        queryKey: ["joke"],
        queryFn: () => getJoke(), // call the server function inside the queryFn
    });

    return (
        <div style={{ padding: 20 }}>
            <h1>Random Joke</h1>

            {/* Loading state */}
            {jokeQuery.isLoading && <p style={{ color: "blue" }}>Loading joke…</p>}

            {/* Error state */}
            {jokeQuery.error && (
                <p style={{ color: "red" }}>Error: {jokeQuery.error.message}</p>
            )}

            {/* Success state */}
            {jokeQuery.data && (
                <p style={{ marginTop: 10, fontSize: 18 }}>{jokeQuery.data}</p>
            )}

            {/* Refresh button */}
            <button style={{ marginTop: 20 }} onClick={() => jokeQuery.refetch()}>
                Get another joke
            </button>
        </div>
    );
}
