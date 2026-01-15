// src/lib/eden/types.ts

export interface EdenError {
  ok: false;
  status: number;
  error: string;
  message: string;
  toast?: string | null;
  fields?: Record<string, string> | null;
  data?: any;
}

export type EdenResponse<T> = { ok: true; status: number; data: T } | EdenError;

/**
 * Extract the success data payload returned by Eden/Elysia Treaty.
 * Supports:
 * - res.data.data
 * - res.data
 */
// Update this in your types file
export type ExtractEdenData<T> = T extends { data: infer U }
  ? U extends { data: infer V }
    ? NonNullable<V>
    : NonNullable<U>
  : never;
/**
 * Extract the error payload returned by Eden/Elysia Treaty.
 * Supports:
 * - res.error.value
 * - res.data.error
 */
export type ExtractEdenError<T> = T extends { error?: { value?: infer U } }
  ? U
  : T extends { data?: { error?: infer U } }
    ? U
    : unknown;
