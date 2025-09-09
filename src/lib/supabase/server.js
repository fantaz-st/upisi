import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createServerSupabase() {
  const jar = await cookies(); // Next 15: async
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return jar.getAll(); // ← NEW
      },
      setAll(cookies) {
        cookies.forEach(
          ({ name, value, options }) => jar.set({ name, value, ...options }) // ← NEW
        );
      },
    },
  });
}
