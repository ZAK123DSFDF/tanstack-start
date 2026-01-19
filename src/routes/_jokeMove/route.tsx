// src/routes/_jokeMove/route.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { SidebarComponent } from "@/components/Sidebar.tsx";
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
  return getCookie("tanstackname");
});
export const Route = createFileRoute("/_jokeMove")({
  shouldReload: false,
  beforeLoad: async ({ location }) => {
    const token = await getAuthToken();
    if (!token) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    // We no longer fetch status here!
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
    }, 2000000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarComponent />
      <main style={{ flex: 1, padding: "40px" }}>
        <Outlet />
      </main>
    </div>
  );
}
