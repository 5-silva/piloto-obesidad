import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { DEMO_PATIENT_USER, DEMO_STAFF_USER } from "@/lib/data/memory";
import { isDemo } from "@/lib/env";
import { createUserClient } from "@/lib/supabase/server";

export const DEMO_COOKIE = "demo_session";

export type StaffViewer = { kind: "staff"; userId: string; name: string; role: "admin" | "coordinador" | "medico" };
export type PatientViewer = { kind: "patient"; userId: string; email: string };
export type Viewer = StaffViewer | PatientViewer | { kind: "anon" };

/** Quién hace la petición. Se calcula una vez por petición. */
export const getViewer = cache(async (): Promise<Viewer> => {
  if (isDemo()) {
    const value = (await cookies()).get(DEMO_COOKIE)?.value;
    if (value === "staff") return { kind: "staff", userId: DEMO_STAFF_USER, name: "Equipo (demo)", role: "admin" };
    if (value === "patient") return { kind: "patient", userId: DEMO_PATIENT_USER, email: "ana@ejemplo.mx" };
    return { kind: "anon" };
  }

  const db = await createUserClient();
  const { data, error } = await db.auth.getClaims();
  const sub = data?.claims?.sub;
  if (error || !sub) return { kind: "anon" };
  const { data: staff } = await db.from("staff").select("name, role").eq("user_id", sub).maybeSingle();
  if (staff) return { kind: "staff", userId: sub, name: String(staff.name), role: staff.role as StaffViewer["role"] };
  return { kind: "patient", userId: sub, email: String(data.claims.email ?? "") };
});

export async function requireStaff(): Promise<StaffViewer> {
  const viewer = await getViewer();
  if (viewer.kind === "staff") return viewer;
  if (viewer.kind === "patient") redirect("/portal");
  redirect("/login?next=/panel");
}

export async function requirePatient(): Promise<PatientViewer> {
  const viewer = await getViewer();
  if (viewer.kind === "patient") return viewer;
  if (viewer.kind === "staff") redirect("/panel");
  redirect("/login?next=/portal");
}

/** Solo acepta rutas internas como destino después de iniciar sesión. */
export function safeNext(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
