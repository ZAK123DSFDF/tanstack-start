import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_jokeMove/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_jokeMove/login"!</div>
}
