// src/lib/eden/treaty-helper.ts
import { EdenResponse, ExtractEdenData } from "./types";

/**
 * Automatically extracts types from Eden Treaty and returns a
 * serializable EdenResponse.
 */
export async function cleanTreaty<T>(
  promise: Promise<T>,
): Promise<EdenResponse<ExtractEdenData<T>>> {
  const res = (await promise) as any;

  // 1. Handle Error Path
  if (res.error) {
    return {
      ok: false,
      status: res.status,
      error: res.error.value?.error || "Error",
      message: res.error.value?.message || "Something went wrong",
      toast: res.error.value?.toast || null,
      fields: res.error.value?.fields || null,
      data: res.error.value?.data || null,
    };
  }

  // 2. Handle Success Path
  // Your service returns { ok: true, data: { ... } }
  // Eden puts that in res.data
  const rawData = res.data;

  // Logic to handle nested or flat data based on your service structure
  const successPayload = rawData?.data ?? rawData;

  return {
    ok: true,
    status: res.status,
    data: successPayload as ExtractEdenData<T>,
  };
}
