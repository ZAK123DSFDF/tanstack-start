// src/components/Sidebar.tsx
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/routes/api.$.ts";
import { cleanTreaty } from "@/lib/eden/treaty-helper.ts";

export function SidebarComponent() {
  // This component lives in the Layout but "listens" to the child loader's data
  const { data: statusRes } = useQuery({
    queryKey: ["system-status-sidebar"],
    queryFn: () => cleanTreaty(api().status.get()),
    staleTime: 10000,
  });

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

      {/* 🟢 System Status Displayed Here */}
      <div
        style={{
          marginTop: "auto",
          padding: "10px",
          backgroundColor: "#eee",
          borderRadius: "4px",
        }}
      >
        <p style={{ fontSize: "12px", margin: 0 }}>System Status:</p>
        <span
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color:
              statusRes?.data?.status === "executional" ? "green" : "orange",
          }}
        >
          {statusRes?.data?.status ?? "Checking..."}
        </span>
        <p style={{ fontSize: "10px", color: "#666" }}>
          v{statusRes?.data?.version}
        </p>
      </div>
    </nav>
  );
}
