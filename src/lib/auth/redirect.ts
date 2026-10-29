/** Resolve return paths against the origin after URL normalization. */
export function safeRedirectUrl(origin: string, path: string | null): URL {
  const fallback = new URL("/dashboard", origin);
  if (!path?.startsWith("/") || path.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(path)) {
    return fallback;
  }
  try {
    const target = new URL(path, origin);
    return target.origin === fallback.origin ? target : fallback;
  } catch {
    return fallback;
  }
}
