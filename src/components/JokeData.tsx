// src/components/JokeData.tsx

import { Await, useNavigate, useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/_jokeMove/jokeMove.tsx";
import { Route as RouteLayout } from "@/routes/_jokeMove/route.tsx";
import { Suspense, useEffect } from "react";

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
function RedisData() {
  const { redisPromise } = Route.useLoaderData();

  return (
    <div
      style={{ marginTop: "20px", padding: "10px", border: "1px dashed #ccc" }}
    >
      <h4>Redis Live Value:</h4>
      <Suspense fallback={<p>Checking Upstash...</p>}>
        <Await promise={redisPromise}>
          {(res) => {
            if (!res.ok) return <p style={{ color: "red" }}>Redis Error</p>;
            return (
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#2196F3",
                }}
              >
                {res.data.value}
              </p>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
function StatusGuard() {
  const { systemStatusPromise } = RouteLayout.useLoaderData();
  const navigate = useNavigate();

  return (
    <Suspense>
      <Await promise={systemStatusPromise}>
        {(status) => {
          // Logic: If status is Operational, kick them back to home
          useEffect(() => {
            if (status.data?.status === "executional") {
              console.log("System operational - Redirecting...");
              navigate({ to: "/" }).then(() => console.log("Redirected"));
            }
          }, [status, navigate]);
          if (status.data?.status !== "executional") {
            return (
              <div className="px-5 py-2">
                <span className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                  v{status.data?.version ?? "0.0.0"}
                </span>
              </div>
            );
          }
          return null;
        }}
      </Await>
    </Suspense>
  );
}
function StaticJoke() {
  const { joke2Promise } = Route.useLoaderData();

  return (
    <>
      <StatusGuard />
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
      <SearchJoke />
      <StaticJoke />
      <hr />
      <RedisData />
    </>
  );
}
