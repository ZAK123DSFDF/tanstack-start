// src/routes/jokeServer.tsx

import { JokeData } from "@/components/JokeData.tsx";
import {
  createFileRoute,
  defer,
  useNavigate,
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
import { queryOptions } from "@tanstack/react-query";
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
    const searchPromise = queryClient.ensureQueryData({
      queryKey: ["joke", "search", query, category],
      queryFn: () =>
        cleanTreaty(api().joke.random.get({ query: { query, category } })),
    });
    const staticJokeOptions = queryOptions({
      queryKey: ["joke", "static"],
      queryFn: () => cleanTreaty(api().joke.random2.get()),
      staleTime: Infinity,
    });
    const staticPromise = queryClient.ensureQueryData(staticJokeOptions);
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
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: Route.id });

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
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Random Jokes</h1>

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
