// src/components/queryFetch.tsx
import {
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { EdenResponse } from "@/lib/eden/types";
import * as React from "react"; // Extract your red error box here

interface QueryFetchProps<T extends {}> {
  options: UseSuspenseQueryOptions<EdenResponse<T>>;
  render: (data: T) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

export function QueryFetch<T extends {}>({
  options,
  render,
  renderEmpty,
}: QueryFetchProps<T>) {
  const { data: res } = useSuspenseQuery(options);

  // 1. Reusable Error Logic
  if (!res.ok) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-xl text-red-600 font-semibold">{res.error}</h2>
        <p className="text-red-500">{res.message}</p>
      </div>
    );
  }

  // 2. Reusable Empty Logic
  const isEmpty =
    res.data === null ||
    res.data === undefined ||
    false ||
    (Array.isArray(res.data) && res.data.length === 0) ||
    (typeof res.data === "object" && Object.keys(res.data).length === 0);

  if (isEmpty) {
    return renderEmpty ? <>{renderEmpty()}</> : <p>No data available.</p>;
  }

  // 3. Success
  return <>{render(res.data)}</>;
}
