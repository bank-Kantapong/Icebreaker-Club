/**
 * Returns the canonical site URL when configured via environment variable,
 * or undefined when no production domain is set (preventing hardcoded dummy domains).
 */
export function getSiteUrl(): URL | undefined {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!rawUrl) {
    return undefined;
  }
  try {
    return new URL(rawUrl);
  } catch {
    return undefined;
  }
}

