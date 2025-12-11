// src/lib/elysia/error-plugin.ts
import { Elysia } from "elysia";

export const errorPlugin = new Elysia().onError(({ error, set }) => {
  console.error("Elysia global error:", error);

  if (error instanceof Error && "status" in error) {
    const status = (error as any).status ?? 500;
    const message = (error as any).message ?? "Something went wrong";
    const toast = (error as any).toast ?? null;
    set.status = status;

    return {
      ok: false,
      status,
      error: error.message,
      message,
      toast,
      fields: (error as any).fields ?? null,
      data: (error as any).data ?? null,
    };
  }

  if (error instanceof Error) {
    set.status = 500;
    return {
      ok: false,
      status: 500,
      error: error.message,
      message: "Server error occurred",
      toast: "something went wrong",
    };
  }

  set.status = 500;
  return {
    ok: false,
    status: 500,
    error: "Internal server error",
    message: "Something went wrong",
    toast: "something went wrong",
  };
});
