import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_jokeMove/jokeOrigin")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "jokeOrigin"!</div>;
}
