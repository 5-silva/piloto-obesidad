import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/env";

let admin: SupabaseClient | null = null;

/**
 * Cliente con la llave secreta: ignora RLS. Solo para escrituras públicas
 * validadas en el servidor (lista de espera, tamizaje, eventos) y para crear
 * cuentas de pacientes. Nunca se importa desde código de cliente.
 */
export function adminClient(): SupabaseClient {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("Falta SUPABASE_SECRET_KEY");
  admin ??= createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
