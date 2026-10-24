"use server";

import { getRepo } from "@/lib/data";
import { evaluateScreening } from "@/lib/screening";
import { parseScreeningForm, tokenSchema, type FieldErrors } from "@/lib/validation";

export type ScreeningState =
  | { status: "idle" }
  | { status: "error"; errors: FieldErrors }
  | { status: "done"; result: "elegible" | "revisar" | "no_elegible"; bmi: number; reasons: string[] };

const OPEN_STATUSES = new Set(["nuevo", "contactado", "tamizaje_enviado"]);

export async function submitScreening(token: string, _prev: ScreeningState, formData: FormData): Promise<ScreeningState> {
  if (!tokenSchema.safeParse(token).success) return { status: "error", errors: { form: "La liga no es válida." } };
  const repo = getRepo();
  const lead = await repo.getLeadByToken(token);
  if (!lead) return { status: "error", errors: { form: "La liga no es válida." } };
  if (!OPEN_STATUSES.has(lead.status)) {
    return { status: "error", errors: { form: "Ya recibimos tu cuestionario. Te escribiremos por WhatsApp." } };
  }

  const parsed = parseScreeningForm(formData);
  if (!parsed.ok) return { status: "error", errors: parsed.errors };
  const d = parsed.data;
  const evaluation = evaluateScreening(d);

  try {
    await repo.saveScreening(lead.id, {
      age: d.age,
      sex: d.sex,
      heightCm: d.heightCm,
      weightKg: d.weightKg,
      bmi: evaluation.bmi,
      waistCm: d.waistCm,
      comorbidities: d.comorbidities,
      riskAnswers: d.riskAnswers,
      medications: d.medications,
      glp1: d.glp1,
      result: evaluation.result,
      flags: evaluation.flags,
    });
  } catch (err) {
    console.error("[tamizaje]", err);
    return { status: "error", errors: { form: "No pudimos guardar tus respuestas. Intenta de nuevo en un momento." } };
  }

  // Al paciente solo le explicamos los motivos de no elegibilidad, no las banderas clínicas.
  const reasons = evaluation.result === "no_elegible" ? evaluation.flags : [];
  return { status: "done", result: evaluation.result, bmi: evaluation.bmi, reasons };
}
