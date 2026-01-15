// src/components/JokeData.tsx

import { Await, useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/_jokeMove/jokeMove.tsx";
import { Suspense } from "react";

function SearchJoke() {
  // 1. Get current params from the URL
  const { query, category } = useSearch({ from: Route.id });

  // 2. Get the promise that was triggered by these exact params
  const { joke1Promise } = Route.useLoaderData();

  return (
    <div className="space-y-4">
      {/* 🟢 You can show the "Target" params here immediately */}
      <p className="text-sm text-gray-500">
        Showing results for: <strong>{query || "All"}</strong> in{" "}
        <strong>{category}</strong>
      </p>

      <Suspense
        fallback={<p className="animate-pulse">Fetching fresh joke...</p>}
      >
        <Await promise={joke1Promise}>
          {(res) => {
            if (!res.ok) return <p>{res.error}</p>;

            return (
              <div className="p-4 bg-white shadow rounded">
                <p style={{ fontSize: "18px" }}>{res.data.message}</p>

                {/* 🟢 Optional: Cross-verify the data matches the search inside the result */}
                <span className="text-xs text-blue-500">
                  Source: {res.data.category}
                </span>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

function StaticJoke() {
  const { joke2Promise } = Route.useLoaderData();
  const { systemStatus } = Route.useRouteContext();

  return (
    <>
      <p style={{ color: "gray" }}>System Version: {systemStatus.version}</p>
      <Suspense
        fallback={<p style={{ color: "green" }}>Loading static joke…</p>}
      >
        <Await promise={joke2Promise}>
          {(res) => {
            if (!res.ok) return <p>Error: {res.message}</p>;
            return <p style={{ fontSize: "18px" }}>{res.data.message}</p>;
          }}
        </Await>
      </Suspense>
    </>
  );
}

export function JokeData() {
  return (
    <>
      <Suspense
        fallback={<p style={{ color: "blue" }}>Loading search result…</p>}
      >
        <SearchJoke />
      </Suspense>
      <Suspense
        fallback={<p style={{ color: "green" }}>Loading static joke…</p>}
      >
        <StaticJoke />
      </Suspense>
    </>
  );
}
