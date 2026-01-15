// src/routes/_jokeMove/route.tsx
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_jokeMove")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
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

        {/* Redirect Links using <Link> */}
        <Link
          to="/jokeMove"
          activeProps={{ style: { color: "blue", fontWeight: "bold" } }}
          style={{ textDecoration: "none", color: "#333" }}
        >
          Go to Search Jokes
        </Link>

        <Link
          to="/jokeOrigin"
          activeProps={{ style: { color: "blue", fontWeight: "bold" } }}
          style={{ textDecoration: "none", color: "#333" }}
        >
          Go to Joke Origins
        </Link>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px" }}>
        <Outlet /> {/* 👈 Child components (jokeMove.tsx, etc.) render here */}
      </main>
    </div>
  );
}
