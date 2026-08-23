import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

let cachedClient: SupabaseClient | null = null;

function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    logger.warn("Supabase environment variables are not configured");
    return null;
  }

  return { url, anonKey };
}

export function createSupabaseServerClient(): SupabaseClient | null {
  if (cachedClient) {
    logger.debug("Reusing cached Supabase server client");
    return cachedClient;
  }

  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  logger.debug("Creating Supabase server client");
  cachedClient = createClient(config.url, config.anonKey);
  return cachedClient;
}
