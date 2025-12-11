
import {Suspense} from "react";
import {Route} from "@/routes/jokeServer.tsx";

export function JokeData(){
    const {joke1,joke2} = Route.useLoaderData();
    return(
        <>
            <Suspense fallback={<p style={{ color: "blue" }}>Loading joke…</p>}>
                <p style={{ marginTop: "10px", fontSize: "18px" }}>{joke1.data.setup}</p>
            </Suspense>
            <Suspense fallback={<p style={{ color: "blue" }}>Loading second joke…</p>}>
                <p style={{ marginTop: "10px", fontSize: "18px" }}>{joke2.data.setup}</p>
            </Suspense>
        </>

    )
}