// Validación de formularios. Todo lo que llega del navegador pasa por aquí
// antes de tocar la base de datos.
import { z } from "zod";
import { normalizeMxPhone } from "@/lib/phone";
import { COMORBIDITIES, RISK_QUESTIONS, type Comorbidity, type RiskAnswer } from "@/lib/screening";
import { WARNING_SIGNS, type CheckinInput, type WarningSign } from "@/lib/checkin";

export const MX_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

export type FieldErrors = Record<string, string>;
export type Parsed<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

function toErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function optional(fd: FormData, key: string): string | undefined {
  const v = str(fd, key);
  return v === "" ? undefined : v;
}

/** Número escrito por una persona: acepta coma decimal («74,5»). */
function dec(fd: FormData, key: string): string | undefined {
  const v = str(fd, key).replace(",", ".");
  return v === "" ? undefined : v;
}

function many(fd: FormData, key: string): string[] {
  return fd.getAll(key).filter((v): v is string => typeof v === "string");
}

const attributionText = z
  .string()
  .max(100)
  .transform((v) => v.replace(/[^\w\-.]/g, "").slice(0, 60) || null)
  .nullable()
  .catch(null);

// ---------- Lista de espera ----------

const leadSchema = z.object({
  name: z.string().min(2, "Escribe tu nombre").max(80, "Usa máximo 80 caracteres"),
  email: z
    .email("Revisa tu correo")
    .max(120)
    .transform((v) => v.toLowerCase()),
  phone: z
    .string()
    .transform((v) => normalizeMxPhone(v))
    .refine((v): v is string => v !== null, "Escribe un celular de 10 dígitos"),
  state: z.enum(MX_STATES, "Elige tu estado"),
  glp1: z.enum(["actualmente", "por_iniciar", "no", "no_se"], "Elige una opción"),
  consent: z.literal("on", "Necesitamos tu autorización para contactarte"),
  website: z.string().max(0).optional(), // trampa para bots: debe llegar vacío
  utmSource: attributionText,
  utmMedium: attributionText,
  utmCampaign: attributionText,
  refCode: attributionText,
});

export type LeadForm = z.infer<typeof leadSchema>;

export function parseLeadForm(fd: FormData): Parsed<LeadForm> {
  const result = leadSchema.safeParse({
    name: str(fd, "name"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    state: str(fd, "state"),
    glp1: str(fd, "glp1"),
    consent: str(fd, "consent"),
    website: str(fd, "website"),
    utmSource: optional(fd, "utm_source") ?? null,
    utmMedium: optional(fd, "utm_medium") ?? null,
    utmCampaign: optional(fd, "utm_campaign") ?? null,
    refCode: optional(fd, "ref") ?? null,
  });
  return result.success ? { ok: true, data: result.data } : { ok: false, errors: toErrors(result.error) };
}

// ---------- Tamizaje ----------

const comorbidityKeys = Object.keys(COMORBIDITIES) as [Comorbidity, ...Comorbidity[]];
const riskKeys = Object.keys(RISK_QUESTIONS) as [RiskAnswer, ...RiskAnswer[]];
const warningKeys = Object.keys(WARNING_SIGNS) as [WarningSign, ...WarningSign[]];

const screeningSchema = z.object({
  age: z.coerce.number("Escribe tu edad").int("Usa años completos").min(12, "Revisa tu edad").max(100, "Revisa tu edad"),
  sex: z.enum(["mujer", "hombre", "otro"]).nullable(),
  heightCm: z.coerce.number("Escribe tu estatura").min(120, "Escribe tu estatura en centímetros").max(220, "Revisa tu estatura"),
  weightKg: z.coerce.number("Escribe tu peso").min(35, "Revisa tu peso").max(300, "Revisa tu peso"),
  waistCm: z.coerce.number().min(50, "Revisa tu cintura").max(250, "Revisa tu cintura").nullable(),
  comorbidities: z.array(z.enum(comorbidityKeys)),
  riskAnswers: z.array(z.enum(riskKeys)),
  medications: z.string().max(500, "Usa máximo 500 caracteres").nullable(),
  glp1: z.enum(["actualmente", "por_iniciar", "no", "no_se"], "Elige una opción"),
  healthConsent: z.literal("on", "Sin tu consentimiento no podemos guardar tus datos de salud"),
});

export type ScreeningForm = z.infer<typeof screeningSchema>;

export function parseScreeningForm(fd: FormData): Parsed<ScreeningForm> {
  const sex = str(fd, "sex");
  // Las preguntas de seguridad no se pueden saltar: o marca alguna o marca «ninguna».
  const riskNone = str(fd, "risk_none") === "on";
  const result = screeningSchema.safeParse({
    age: str(fd, "age") || undefined,
    sex: sex === "" ? null : sex,
    heightCm: dec(fd, "height_cm"),
    weightKg: dec(fd, "weight_kg"),
    waistCm: dec(fd, "waist_cm") ?? null,
    comorbidities: many(fd, "comorbidities"),
    riskAnswers: many(fd, "risk"),
    medications: optional(fd, "medications") ?? null,
    glp1: str(fd, "glp1"),
    healthConsent: str(fd, "health_consent"),
  });
  const errors = result.success ? {} : toErrors(result.error);
  const risks = many(fd, "risk");
  if (risks.length === 0 && !riskNone) errors.riskAnswers ??= "Marca las que apliquen o «Ninguna aplica para mí»";
  if (risks.length > 0 && riskNone) errors.riskAnswers ??= "Marcaste «Ninguna» y también otras opciones";
  if (!result.success || Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: result.data };
}

// ---------- Check-in semanal ----------

const scale = (max: number) => z.coerce.number().int().min(0).max(max).nullable();

const checkinSchema = z.object({
  weightKg: z.coerce.number().min(35, "Revisa tu peso").max(300, "Revisa tu peso").nullable(),
  waistCm: z.coerce.number().min(50, "Revisa tu cintura").max(250, "Revisa tu cintura").nullable(),
  tookDose: z.enum(["si", "no", "no_aplica"]).nullable(),
  nausea: scale(3),
  constipation: scale(3),
  waterLiters: z.coerce.number().min(0).max(8, "Revisa los litros").nullable(),
  strengthSessions: z.coerce.number().int().min(0).max(14, "Revisa las sesiones").nullable(),
  mood: z.coerce.number().int().min(1).max(5).nullable(),
  warningSigns: z.array(z.enum(warningKeys)),
  note: z.string().max(1000, "Usa máximo 1000 caracteres").nullable(),
});

export function parseCheckinForm(fd: FormData): Parsed<CheckinInput> {
  const result = checkinSchema.safeParse({
    weightKg: dec(fd, "weight_kg") ?? null,
    waistCm: dec(fd, "waist_cm") ?? null,
    tookDose: optional(fd, "took_dose") ?? null,
    nausea: optional(fd, "nausea") ?? null,
    constipation: optional(fd, "constipation") ?? null,
    waterLiters: dec(fd, "water_liters") ?? null,
    strengthSessions: optional(fd, "strength_sessions") ?? null,
    mood: optional(fd, "mood") ?? null,
    warningSigns: many(fd, "warning"),
    note: optional(fd, "note") ?? null,
  });
  if (!result.success) return { ok: false, errors: toErrors(result.error) };
  if (result.data.weightKg === null) return { ok: false, errors: { weightKg: "Escribe tu peso de esta semana" } };
  return { ok: true, data: result.data };
}

// ---------- Panel ----------

const costSchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Elige el mes"),
  channel: z
    .string()
    .min(2, "Escribe el canal")
    .max(40)
    .transform((v) => v.toLowerCase()),
  amountMxn: z.coerce.number("Escribe el monto").min(0, "El monto no puede ser negativo").max(1_000_000),
  hours: z.coerce.number().min(0).max(744).catch(0),
  note: z.string().max(300).nullable(),
});

export type CostForm = z.infer<typeof costSchema>;

export function parseCostForm(fd: FormData): Parsed<CostForm> {
  const result = costSchema.safeParse({
    month: str(fd, "month"),
    channel: str(fd, "channel"),
    amountMxn: str(fd, "amount_mxn") || undefined,
    hours: str(fd, "hours") || 0,
    note: optional(fd, "note") ?? null,
  });
  return result.success ? { ok: true, data: result.data } : { ok: false, errors: toErrors(result.error) };
}

export const emailSchema = z.email("Revisa tu correo").transform((v) => v.trim().toLowerCase());
export const otpSchema = z.string().regex(/^\d{6}$/, "El código tiene 6 dígitos");
export const tokenSchema = z.string().regex(/^[a-f0-9]{32,64}$/);
export const uuidSchema = z.uuid();
