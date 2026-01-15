// src/components/serverFetch.tsx
import { use } from "react";
import * as React from "react";
import { EdenResponse } from "@/lib/eden/types";

// T is the actual shape of the "data" (e.g. { message: string })
interface ServerFetchProps<T extends {}> {
  fetcher: () => Promise<EdenResponse<T>>;
  render: (data: T) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

export function ServerFetch<T extends {}>({
  fetcher,
  render,
  renderEmpty,
}: ServerFetchProps<T>) {
  const res = use(fetcher());
  console.log("ServerFetch response:", res.data);
  // 1. Handle Error branch (TypeScript now knows this is EdenError)
  if (!res.ok) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-red-600 font-semibold">{res.error}</h2>
          <span className="text-xs bg-red-200 px-2 py-1 rounded text-red-700">
            {res.status}
          </span>
        </div>
        <p className="text-red-500 mt-1">{res.message}</p>
        {res.toast && (
          <p className="text-xs italic text-red-400 mt-2">💡 {res.toast}</p>
        )}
      </div>
    );
  }
  const isEmpty = React.useMemo(() => {
    if (!res.data) return true;

    if (Array.isArray(res.data)) return res.data.length === 0;
    if (typeof res.data === "object") {
      // Check for empty message if it's a joke object
      if ("message" in res.data && !res.data.message) return true;
      // Check for generic empty object {}
      return Object.keys(res.data).length === 0;
    }
    return false;
  }, [res.data]);

  if (isEmpty) {
    return renderEmpty ? <>{renderEmpty()}</> : <p>No data available.</p>;
  }
  // 2. Success branch (TypeScript now knows res.data exists and is type T)
  return <>{render(res.data)}</>;
}
