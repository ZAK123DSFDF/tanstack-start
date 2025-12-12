import { Suspense, use } from "react";
import { Route } from "@/routes/jokeServer.tsx";

export function JokeData() {
    const { joke1, joke2 } = Route.useLoaderData();

    return (
        <>
            <Suspense fallback={<p style={{ color: "blue" }}>Loading joke…</p>}>
                <JokeItem data={joke1}/>
            </Suspense>

            <Suspense fallback={<p style={{ color: "blue" }}>Loading second joke…</p>}>
                <JokeItem data={joke2}/>
            </Suspense>
        </>
    );
}

function JokeItem({ data }) {
    console.log("data:", data);
    const result = use(data);
    console.log("data:", data);
    return (
        <p style={{ marginTop: "10px", fontSize: "18px" }}>{result?.setup}</p>
    );
}
