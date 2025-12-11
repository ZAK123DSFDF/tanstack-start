export function redirect(
  path: string,
  baseUrl: string,
  requestUrl?: string,
): Response {
  // Fallback if requestUrl is provided
  const requestOrigin = requestUrl ? new URL(requestUrl).origin : null;

  // Priority: baseUrl mandatory, fallback to requestOrigin
  const finalBaseUrl = baseUrl || requestOrigin;

  if (!finalBaseUrl) {
    throw new Error(
      "redirect() requires a baseUrl. Neither baseUrl nor requestUrl provided.",
    );
  }

  const fullUrl = new URL(path, finalBaseUrl).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: fullUrl,
    },
  });
}
