// src/routes/jokeServer.tsx

import { JokeData } from "@/components/JokeData.tsx";
import {
  createFileRoute,
  defer,
  useNavigate,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { api } from "@/routes/api.$.ts";
import { cleanTreaty } from "@/lib/eden/treaty-helper.ts";
import { z } from "zod";
import {
  DEFAULT_JOKE_CATEGORY,
  JOKE_CATEGORIES,
} from "@/lib/constants/jokes.ts";
import { useEffect, useState } from "react";
import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation.ts";
const jokeSearchSchema = z.object({
  query: z.string().optional().catch(""),
  category: z.enum(JOKE_CATEGORIES).optional().catch(DEFAULT_JOKE_CATEGORY),
});

export const Route = createFileRoute("/_jokeMove/jokeMove")({
  validateSearch: (search) => jokeSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    query: search.query,
    category: search.category,
  }),
  loader: ({ context: { queryClient }, deps: { query, category } }) => {
    const searchPromise = queryClient.fetchQuery({
      queryKey: ["joke", "search", query, category],
      queryFn: () =>
        cleanTreaty(api().joke.random.get({ query: { query, category } })),
      staleTime: 50000,
      gcTime: 50000,
    });
    const staticJokeOptions = queryOptions({
      queryKey: ["joke", "static"],
      queryFn: () => cleanTreaty(api().joke.random2.get()),
      staleTime: 50000,
      gcTime: 50000,
    });
    const staticPromise = queryClient.fetchQuery(staticJokeOptions);
    return {
      joke1Promise: defer(searchPromise),
      joke2Promise: defer(staticPromise),
    };
  },
  component: JokePage,
});

// -----------------------------
// 3️⃣ Page component (FIXED: Accessing data from useLoader())
// -----------------------------
function JokePage() {
  const router = useRouter();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: Route.id });
  const queryClient = useQueryClient();
  // Local state for the input to allow smooth typing
  const [tempQuery, setTempQuery] = useState(search.query ?? "");

  // Debounce: Update URL 400ms after user stops typing
  useEffect(() => {
    const delay = setTimeout(() => {
      navigate({
        search: (prev) => ({ ...prev, query: tempQuery || undefined }),
        replace: true,
      }).then(() => console.log("Navigated"));
    }, 400);
    return () => clearTimeout(delay);
  }, [tempQuery, navigate]);
  const revalidateJokes = () => {
    // This refreshes both the search results and the static joke
    queryClient
      .invalidateQueries({ queryKey: ["joke", "search"] })
      .then(() => console.log("Jokes revalidated"));
    router.invalidate();

    console.log("Everything revalidated!");
  };

  const successMutation = useAppMutation(
    () => cleanTreaty(api().joke["success-demo"].post()),
    { onSettled: revalidateJokes },
  );

  const errorMutation = useAppMutation(
    () => cleanTreaty(api().joke["error-demo"].post()),
    { onSettled: revalidateJokes },
  );
  const resetMutation = useAppMutation(
    () => cleanTreaty(api().joke["reset-demo"].post()),
    { onSettled: revalidateJokes },
  );
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Random Jokes</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => successMutation.mutate(undefined)}
          disabled={successMutation.isPending}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "4px",
          }}
        >
          {successMutation.isPending ? "Processing..." : "Trigger Success"}
        </button>

        <button
          onClick={() => errorMutation.mutate(undefined)}
          disabled={errorMutation.isPending}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            borderRadius: "4px",
          }}
        >
          {errorMutation.isPending ? "Processing..." : "Trigger Error"}
        </button>
        <button
          onClick={() => resetMutation.mutate(undefined)}
          disabled={resetMutation.isPending}
          style={{
            padding: "8px 16px",
            backgroundColor: "#607d8b", // Grey color
            color: "white",
            borderRadius: "4px",
          }}
        >
          {resetMutation.isPending ? "Resetting..." : "Reset to v1"}
        </button>
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for a joke..."
          value={tempQuery}
          onChange={(e) => setTempQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* Category Select */}
        <select
          value={search.category}
          onChange={(e) => {
            navigate({
              search: (prev) => ({ ...prev, category: e.target.value as any }),
              replace: true,
            }).then(() => console.log("Navigated"));
          }}
          style={{ padding: "8px", borderRadius: "4px" }}
        >
          {JOKE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <JokeData />
    </div>
  );
}
