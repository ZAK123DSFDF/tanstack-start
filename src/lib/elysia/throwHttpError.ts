export function throwHttpError({
  status = 400,
  error = "Request failed",
  message = "Something went wrong",
  toast = null,
  fields = null,
  data = null,
}: {
  status?: number;
  error?: string;
  message?: string;
  toast?: string | null; // optional
  fields?: Record<string, string> | null;
  data?: any;
}) {
  throw { ok: false, status, error, message, toast, fields, data };
}
