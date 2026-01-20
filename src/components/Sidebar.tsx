// src/components/Sidebar.tsx
import { Link, Await, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Route as RouteLayout } from "@/routes/_jokeMove/route.tsx";
import { Suspense } from "react";

export function SidebarComponent() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 🟢 Get the promise from the child route loader
  // Note: This will only be available when the current route is /jokeMove
  const { systemStatusPromise } = RouteLayout.useLoaderData();

  const handleRefreshStatus = () => {
    // Since we are using a promise from the loader, to get "new" data
    // without useQuery, we must tell the router to re-run the loader.
    queryClient
      .invalidateQueries({ queryKey: ["system-status"] })
      .then(() => console.log("System status query invalidated"));
    router.invalidate();
  };

  return (
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

      <div
        style={{
          marginTop: "auto",
          padding: "10px",
          backgroundColor: "#eee",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "12px", margin: 0 }}>System Status:</p>
          <button
            onClick={handleRefreshStatus}
            style={{ fontSize: "10px", cursor: "pointer" }}
          >
            🔄
          </button>
        </div>

        {/* 🟢 Using Await instead of useQuery */}
        <Suspense
          fallback={<span style={{ fontSize: "14px" }}>Checking...</span>}
        >
          <Await promise={systemStatusPromise}>
            {(statusRes) => (
              <>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color:
                      statusRes?.data?.status === "executional"
                        ? "green"
                        : "orange",
                  }}
                >
                  {statusRes?.data?.status ?? "Unknown"}
                </span>
                <p style={{ fontSize: "10px", color: "#666" }}>
                  v{statusRes?.data?.version}
                </p>
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </nav>
  );
}
