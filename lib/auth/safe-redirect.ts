const DEFAULT_PATH = "/";

/**
 * Restricts post-auth redirects to same-origin relative paths (open-redirect hardening).
 */
export function sanitizePostAuthRedirect(next: string | null): string {
  if (!next || next === DEFAULT_PATH) {
    return DEFAULT_PATH;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_PATH;
  }

  if (next.includes("\\") || next.includes(":")) {
    return DEFAULT_PATH;
  }

  return next;
}
