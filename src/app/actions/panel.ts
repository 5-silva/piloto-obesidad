"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { getRepo } from "@/lib/data";
import { todayMx } from "@/lib/dates";
import { parseCostForm, uuidSchema } from "@/lib/validation";

// Cada acción es un punto de entrada público: verifica el rol antes de todo.

const leadStatus = z.enum([
  "nuevo",
  "contactado",
  "tamizaje_enviado",
  "elegible",
  "revisar",
  "no_elegible",
  "agendado",
  "activo",
  "descartado",
]);

function refresh() {
  revalidatePath("/panel", "layout");
}

export async function setLeadStatus(formData: FormData) {
  await requireStaff();
  const id = uuidSchema.parse(formData.get("id"));
  const status = leadStatus.parse(formData.get("status"));
  await getRepo().updateLead(id, { status });
  refresh();
}

export async function saveLeadNotes(formData: FormData) {
  await requireStaff();
  const id = uuidSchema.parse(formData.get("id"));
  const notes = z
    .string()
    .max(2000)
    .parse(String(formData.get("notes") ?? ""))
    .trim();
  await getRepo().updateLead(id, { notes: notes || null });
  refresh();
}

export type ActivateState = { status: "idle" } | { status: "error"; message: string } | { status: "ok"; patientId: string };

export async function activatePatient(_prev: ActivateState, formData: FormData): Promise<ActivateState> {
  await requireStaff();
  const parsed = z
    .object({
      leadId: uuidSchema,
      startDate: z.iso.date(),
      programFormat: z.enum(["individual", "grupal"]),
    })
    .safeParse({
      leadId: formData.get("leadId"),
      startDate: formData.get("startDate") || todayMx(),
      programFormat: formData.get("programFormat") || "individual",
    });
  if (!parsed.success) return { status: "error", message: "Revisa la fecha de inicio." };
  try {
    const p = await getRepo().activatePatient(parsed.data.leadId, {
      startDate: parsed.data.startDate,
      programFormat: parsed.data.programFormat,
    });
    refresh();
    return { status: "ok", patientId: p.id };
  } catch (err) {
    console.error("[activar paciente]", err);
    return { status: "error", message: "No se pudo activar. Revisa que el correo del lead sea válido." };
  }
}

export async function updatePatient(formData: FormData) {
  await requireStaff();
  const id = uuidSchema.parse(formData.get("id"));
  const patch = z
    .object({
      status: z.enum(["activo", "pausa", "baja", "completado"]).optional(),
      deposit: z.enum(["ninguno", "pendiente", "pagado", "reembolsado"]).optional(),
      programFormat: z.enum(["individual", "grupal"]).optional(),
      dropReason: z.string().max(500).optional(),
    })
    .parse({
      status: formData.get("status") || undefined,
      deposit: formData.get("deposit") || undefined,
      programFormat: formData.get("programFormat") || undefined,
      dropReason: (formData.get("dropReason") as string | null)?.trim() || undefined,
    });
  await getRepo().updatePatient(id, patch);
  refresh();
}

export type CostState = { status: "idle" } | { status: "error"; errors: Record<string, string> } | { status: "ok" };

export async function saveCost(_prev: CostState, formData: FormData): Promise<CostState> {
  await requireStaff();
  const parsed = parseCostForm(formData);
  if (!parsed.ok) return { status: "error", errors: parsed.errors };
  await getRepo().upsertCost({ ...parsed.data, month: `${parsed.data.month}-01` });
  refresh();
  return { status: "ok" };
}
