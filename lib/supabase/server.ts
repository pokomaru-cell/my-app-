import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { logger } from "@/lib/logger";

export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  const config = getSupabaseConfig();
  if (!config) {
    logger.warn("Supabase environment variables are not configured");
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; proxy refreshes sessions.
        }
      },
    },
  });
}
