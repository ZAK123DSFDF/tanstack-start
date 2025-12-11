import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'
import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'
import {JokeController} from "@/elysia/joke/joke.controller.ts";
import {errorPlugin} from "@/lib/elysia/error-plugin.ts";
const joke = new JokeController();
const app = new Elysia({
    prefix: '/api'
}).use(errorPlugin).get('/joke/random', joke.random).get('/joke/random2', joke.random)

const handle = ({ request }: { request: Request }) => app.fetch(request)

export const Route = createFileRoute('/api/$')({
    server: {
        handlers: {
            GET: handle,
            POST: handle,
            PATCH: handle,
            DELETE: handle,
            PUT: handle
        }
    }
})
export const api = createIsomorphicFn()
    .server(() => treaty(app).api)
    .client(() => treaty<typeof app>('localhost:3000').api)