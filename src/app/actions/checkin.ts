"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requirePatient } from "@/lib/auth";
import { guidanceFor, type CheckinGuidance } from "@/lib/checkin";
import { getRepo } from "@/lib/data";
import { mails, sendMail } from "@/lib/email";
import { parseCheckinForm, type FieldErrors } from "@/lib/validation";

export type CheckinState =
  | { status: "idle" }
  | { status: "error"; errors: FieldErrors }
  | { status: "ok"; week: number; guidance: CheckinGuidance };

export async function saveCheckin(_prev: CheckinState, formData: FormData): Promise<CheckinState> {
  const viewer = await requirePatient();
  const repo = getRepo();
  const patient = await repo.myPatient(viewer.userId);
  if (!patient || patient.status !== "activo") {
    return { status: "error", errors: { form: "Tu programa no está activo. Escríbenos por WhatsApp." } };
  }
  const parsed = parseCheckinForm(formData);
  if (!parsed.ok) return { status: "error", errors: parsed.errors };

  try {
    const saved = await repo.saveMyCheckin(viewer.userId, patient.id, parsed.data);
    const alertTo = process.env.STAFF_ALERT_EMAIL;
    if (saved.flagged && alertTo)
      after(() => sendMail({ to: alertTo, ...mails.staffFlagAlert(saved.week) }).then(() => undefined));
    revalidatePath("/portal");
    return { status: "ok", week: saved.week, guidance: guidanceFor(parsed.data) };
  } catch (err) {
    console.error("[check-in]", err);
    return { status: "error", errors: { form: "No pudimos guardar tu check-in. Intenta de nuevo en un momento." } };
  }
}
