// src/components/JokeData.tsx

import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/jokeServer.tsx";
import { QueryFetch } from "@/components/queryFetch.tsx";
import { Suspense } from "react";

function SearchJoke() {
  const { query, category } = useSearch({ from: Route.fullPath });
  const { joke1Promise } = Route.useLoaderData();
  return (
    <QueryFetch
      options={{
        queryKey: ["joke", "search", query, category],
        queryFn: () => joke1Promise,
      }}
      render={(data) => <p style={{ fontSize: "18px" }}>{data.message}</p>}
    />
  );
}

function StaticJoke() {
  const { joke2Promise } = Route.useLoaderData();
  return (
    <QueryFetch
      options={{
        queryKey: ["joke", "static"],
        queryFn: () => joke2Promise,
        staleTime: Infinity,
      }}
      render={(data) => <p style={{ fontSize: "18px" }}>{data.message}</p>}
    />
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
