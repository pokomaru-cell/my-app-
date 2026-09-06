import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

let cachedClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient | null {
  if (cachedClient) {
    return cachedClient;
  }

  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  cachedClient = createBrowserClient(config.url, config.anonKey);
  return cachedClient;
}
