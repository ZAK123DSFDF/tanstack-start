// src/routes/_jokeMove/route.tsx
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { cleanTreaty } from "@/lib/eden/treaty-helper.ts";
import { api } from "@/routes/api.$.ts";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] ?? null
  );
}
const getAuthToken = createServerFn({ method: "GET" }).handler(async () => {
  return getCookie("");
});
export const Route = createFileRoute("/_jokeMove")({
  shouldReload: false,

  beforeLoad: async ({ context: { queryClient }, location }) => {
    // 1. Get cookie from document (client) OR headers (server)
    const token = await getAuthToken();

    if (!token) {
      throw redirect({
        to: "/",
        search: { redirect: location.href },
      });
    }
    try {
      const statusData = await queryClient.ensureQueryData({
        queryKey: ["system-status"],
        queryFn: () => cleanTreaty(api().status.get()),
        staleTime: 20_000, // ✅ 10 seconds
      });

      if (!statusData.ok) {
        throw redirect({ to: "/" });
      }

      return { systemStatus: statusData.data };
    } catch (error) {
      if ((error as any)?.status === 307) throw error;
      throw new Error("System check failed");
    }
  },

  component: LayoutComponent,
});

function LayoutComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = getClientCookie("tanstackname");
      if (!token) {
        navigate({ to: "/" }).then(() => console.log("Redirected to login"));
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      // ✅ remove cookie every 2 seconds
      document.cookie = "tanstackname=; Max-Age=0; path=/; SameSite=Lax";
      checkAuth();
    }, 200000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav
        style={{
          width: "250px",
          backgroundColor: "#f4f4f4",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          borderRight: "1px solid #ddd",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Joke Navigation</h3>

        <Link to="/jokeMove">Go to Search Jokes</Link>
        <Link to="/jokeOrigin">Go to Joke Origins</Link>
      </nav>

      <main style={{ flex: 1, padding: "40px" }}>
        <Outlet />
      </main>
    </div>
  );
}
