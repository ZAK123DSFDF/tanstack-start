// src/components/JokeData.tsx

import { Suspense } from "react";
import { Route } from "@/routes/jokeServer";
import { ServerFetch } from "@/components/serverFetch.tsx";

export function JokeData() {
  const { joke1, joke2 } = Route.useLoaderData();

  return (
    <>
      <Suspense fallback={<p style={{ color: "blue" }}>Loading joke…</p>}>
        <ServerFetch
          fetcher={() => joke1}
          errorTitle="Joke 1 Error"
          render={(data) => (
            <p style={{ marginTop: "10px", fontSize: "18px" }}>{data.setup}</p>
          )}
        />
      </Suspense>

      <Suspense
        fallback={<p style={{ color: "blue" }}>Loading second joke…</p>}
      >
        <ServerFetch
          fetcher={() => joke2}
          errorTitle="Joke 2 Error"
          render={(data) => (
            <p style={{ marginTop: "10px", fontSize: "18px" }}>{data.setup}</p>
          )}
        />
      </Suspense>
    </>
  );
}
