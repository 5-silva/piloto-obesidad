import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "@/lib/env";

/** Cliente con la sesión del usuario: todas las consultas pasan por RLS. */
export async function createUserClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Desde un Server Component no se pueden escribir cookies; el proxy renueva la sesión.
        }
      },
    },
  });
}
