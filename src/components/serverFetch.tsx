import { use } from "react";
import { EdenError, EdenResponse, ExtractEdenData } from "@/lib/eden/types";
import * as React from "react";

interface ServerFetchProps<TFetcher extends () => Promise<any>> {
  fetcher: TFetcher;
  errorTitle?: string;
  render: (
    data: ExtractEdenData<Awaited<ReturnType<TFetcher>>>,
  ) => React.ReactNode;
}

export function ServerFetch<TFetcher extends () => Promise<EdenResponse<any>>>({
  fetcher,
  render,
  errorTitle = "Error",
}: ServerFetchProps<TFetcher>) {
  type TData = ExtractEdenData<Awaited<ReturnType<TFetcher>>>;

  const res = use(fetcher());
  console.log("ServerFetch res:", res);

  let raw: any = null;

  // -------- FIXED LOGIC ----------
  if (res && typeof res === "object" && "ok" in res) {
    raw = res; // full EdenResponse
  } else if (res?.error?.value) {
    raw = res.error.value;
  } else {
    raw = null;
  }

  console.log("ServerFetch raw:", raw);

  if (!raw) {
    const fallbackError: EdenError = {
      ok: false,
      message: "Unknown server response",
      error: "Unknown",
      status: 500,
    };

    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-xl text-red-600 font-semibold">{errorTitle}</h2>
        <p className="text-red-500">{fallbackError.message}</p>
      </div>
    );
  }

  if (raw.ok !== true) {
    const err = raw as EdenError;

    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h2 className="text-xl font-semibold text-red-600">{errorTitle}</h2>
        <p className="text-red-500">{err.message}</p>
      </div>
    );
  }

  // SUCCESS CASE
  return <>{render(raw.data as TData)}</>;
}
