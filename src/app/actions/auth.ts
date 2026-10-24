"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE, safeNext } from "@/lib/auth";
import { isDemo } from "@/lib/env";
import { createUserClient } from "@/lib/supabase/server";
import { emailSchema, otpSchema } from "@/lib/validation";

export type LoginState =
  | { status: "idle" }
  | { status: "code_sent"; email: string; message?: string }
  | { status: "error"; step: "email" | "code"; email?: string; message: string };

export async function requestCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { status: "error", step: "email", message: "Revisa tu correo." };
  const db = await createUserClient();
  const { error } = await db.auth.signInWithOtp({ email: email.data, options: { shouldCreateUser: false } });
  if (error && error.status === 429) {
    return { status: "error", step: "email", email: email.data, message: "Pediste varios códigos seguidos. Espera un minuto." };
  }
  // Misma respuesta exista o no la cuenta: no revelamos quién es paciente.
  return { status: "code_sent", email: email.data };
}

export async function verifyCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const token = otpSchema.safeParse(String(formData.get("token") ?? "").replace(/\s/g, ""));
  if (!email.success) return { status: "error", step: "email", message: "Revisa tu correo." };
  if (!token.success) return { status: "error", step: "code", email: email.data, message: "El código tiene 6 dígitos." };
  const db = await createUserClient();
  const { error } = await db.auth.verifyOtp({ email: email.data, token: token.data, type: "email" });
  if (error) {
    return { status: "error", step: "code", email: email.data, message: "El código no es válido o ya venció. Pide uno nuevo." };
  }
  redirect(safeNext(String(formData.get("next") ?? ""), "/login"));
}

export async function demoLogin(formData: FormData) {
  if (!isDemo()) redirect("/login");
  const role = formData.get("role") === "staff" ? "staff" : "patient";
  (await cookies()).set(DEMO_COOKIE, role, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect(role === "staff" ? "/panel" : "/portal");
}

export async function logout() {
  if (isDemo()) {
    (await cookies()).delete(DEMO_COOKIE);
  } else {
    const db = await createUserClient();
    await db.auth.signOut();
  }
  redirect("/login");
}
