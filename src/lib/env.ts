// Modo de ejecución. Sin Supabase configurado la app corre en modo demo:
// datos de ejemplo en memoria y acceso con un clic. En producción el modo demo
// solo se permite si se pide explícitamente, y entonces se avisa en cada página.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function isDemo(): boolean {
  return supabaseUrl === "";
}

export function assertModeAllowed(): void {
  if (isDemo() && process.env.NODE_ENV === "production" && process.env.DEMO_MODE !== "true") {
    throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL. Configura Supabase o define DEMO_MODE=true para publicar la demo.");
  }
}
