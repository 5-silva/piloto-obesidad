// Check-in semanal: qué se pregunta y cuándo se levanta una alerta.
// La base de datos recalcula la alerta con la misma regla (trigger checkins_compute).
// Textos pendientes de validación por el médico responsable.

export const WARNING_SIGNS = {
  dolor_abdominal: "Dolor fuerte en el abdomen que no se quita",
  vomito: "Vómito que no para o no tolero líquidos",
  deshidratacion: "Mareo intenso, boca muy seca u orino muy poco",
  otro_urgente: "Otro síntoma que me preocupa mucho",
} as const;

export type WarningSign = keyof typeof WARNING_SIGNS;

export const SYMPTOM_SCALE = ["Nada", "Poco", "Moderado", "Mucho"] as const;
export const MOOD_SCALE = ["Muy mal", "Mal", "Regular", "Bien", "Muy bien"] as const;

export type CheckinInput = {
  weightKg: number | null;
  waistCm: number | null;
  tookDose: "si" | "no" | "no_aplica" | null;
  nausea: number | null;
  constipation: number | null;
  waterLiters: number | null;
  strengthSessions: number | null;
  mood: number | null;
  warningSigns: WarningSign[];
  note: string | null;
};

export function isFlagged(c: Pick<CheckinInput, "warningSigns" | "mood" | "nausea">): boolean {
  return c.warningSigns.length > 0 || c.mood === 1 || c.nausea === 3;
}

export type CheckinGuidance = "urgente" | "animo" | "sintomas" | "normal";

/** Qué mensaje mostrar al paciente después de enviar el check-in. */
export function guidanceFor(c: Pick<CheckinInput, "warningSigns" | "mood" | "nausea">): CheckinGuidance {
  if (c.warningSigns.length > 0) return "urgente";
  if (c.mood === 1) return "animo";
  if (c.nausea === 3) return "sintomas";
  return "normal";
}
