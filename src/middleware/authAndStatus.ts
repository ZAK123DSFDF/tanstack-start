// src/middleware/authAndStatus.ts
import { createMiddleware } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { api } from "@/routes/api.$.ts";
import { cleanTreaty } from "@/lib/eden/treaty-helper.ts";

export const authAndStatusMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const token = getCookie("tanstackname");
    const url = new URL(request.url);

    // 1. Auth Guard
    if (!token) {
      return Response.redirect(
        new URL(`/?redirect=${url.href}`, request.url).toString(),
      );
    }

    try {
      // 2. Heavy Status Check (with your 2s delay)
      const res = await cleanTreaty(api().status.get());

      if (!res.ok) {
        return Response.redirect(new URL("/", request.url).toString());
      }

      // 3. 🟢 THE FIX: Use 'context' instead of 'sendContext'
      return next();
    } catch (error) {
      return Response.redirect(new URL("/", request.url).toString());
    }
  },
);
