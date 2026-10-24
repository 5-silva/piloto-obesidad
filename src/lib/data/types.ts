import type { Eligibility } from "@/lib/screening";
import type { CheckinInput } from "@/lib/checkin";

export type LeadStatus =
  | "nuevo"
  | "contactado"
  | "tamizaje_enviado"
  | "elegible"
  | "revisar"
  | "no_elegible"
  | "agendado"
  | "activo"
  | "descartado";
export type Glp1Status = "actualmente" | "por_iniciar" | "no" | "no_se";
export type PatientStatus = "activo" | "pausa" | "baja" | "completado";
export type DepositStatus = "ninguno" | "pendiente" | "pagado" | "reembolsado";
export type ProgramFormat = "individual" | "grupal";
export type EventName = "landing_view" | "cta_click" | "waitlist_submit";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  tamizaje_enviado: "Tamizaje enviado",
  elegible: "Apto",
  revisar: "Revisar con médico",
  no_elegible: "No cumple criterios",
  agendado: "Valoración agendada",
  activo: "Paciente activo",
  descartado: "Descartado",
};

export const GLP1_LABELS: Record<Glp1Status, string> = {
  actualmente: "Ya usa un medicamento para el peso",
  por_iniciar: "Está por iniciar",
  no: "No usa",
  no_se: "No sabe",
};

export const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  activo: "Activo",
  pausa: "En pausa",
  baja: "Baja",
  completado: "Completó",
};

export const DEPOSIT_LABELS: Record<DepositStatus, string> = {
  ninguno: "Sin depósito",
  pendiente: "Pendiente",
  pagado: "Pagado",
  reembolsado: "Reembolsado",
};

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  state: string | null;
  glp1: Glp1Status;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  refCode: string | null;
  priceShownMxn: number | null;
  status: LeadStatus;
  screeningToken: string;
  notes: string | null;
};

export type Screening = {
  leadId: string;
  createdAt: string;
  age: number;
  sex: "mujer" | "hombre" | "otro" | null;
  heightCm: number;
  weightKg: number;
  bmi: number;
  waistCm: number | null;
  comorbidities: string[];
  riskAnswers: string[];
  medications: string | null;
  glp1: Glp1Status;
  result: Eligibility;
  flags: string[];
};

export type Patient = {
  id: string;
  leadId: string | null;
  userId: string | null;
  createdAt: string;
  displayName: string;
  email: string;
  phone: string;
  startDate: string;
  status: PatientStatus;
  programFormat: ProgramFormat;
  deposit: DepositStatus;
  channel: string | null;
  droppedAt: string | null;
  dropReason: string | null;
};

export type Checkin = {
  id: string;
  patientId: string;
  createdAt: string;
  week: number;
  weightKg: number | null;
  waistCm: number | null;
  tookDose: "si" | "no" | "no_aplica" | null;
  nausea: number | null;
  constipation: number | null;
  waterLiters: number | null;
  strengthSessions: number | null;
  mood: number | null;
  warningSigns: string[];
  note: string | null;
  flagged: boolean;
};

export type AppEvent = {
  createdAt: string;
  name: EventName;
  sessionId: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  refCode: string | null;
};

export type ChannelCost = {
  id: string;
  month: string;
  channel: string;
  amountMxn: number;
  hours: number;
  note: string | null;
};

export type Attribution = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  refCode: string | null;
};

export type NewLead = Attribution & {
  name: string;
  email: string;
  phone: string;
  state: string | null;
  glp1: Glp1Status;
  priceShownMxn: number;
  privacyVersion: string;
};

export type NewScreening = Omit<Screening, "leadId" | "createdAt">;

/** Todo lo que el panel necesita para calcular métricas. */
export type Snapshot = {
  leads: Lead[];
  screenings: Screening[];
  patients: Patient[];
  checkins: Checkin[];
  events: AppEvent[];
  costs: ChannelCost[];
};

/** Acceso a datos. Las funciones de equipo asumen que el llamador ya verificó el rol. */
export interface Repo {
  createLead(input: NewLead): Promise<{ id: string; screeningToken: string }>;
  recordEvent(event: Omit<AppEvent, "createdAt">): Promise<void>;
  getLeadByToken(token: string): Promise<Lead | null>;
  saveScreening(leadId: string, screening: NewScreening): Promise<void>;

  snapshot(): Promise<Snapshot>;
  updateLead(id: string, patch: { status?: LeadStatus; notes?: string | null }): Promise<void>;
  activatePatient(
    leadId: string,
    opts: { startDate: string; programFormat: ProgramFormat },
  ): Promise<Patient>;
  updatePatient(
    id: string,
    patch: Partial<Pick<Patient, "status" | "deposit" | "programFormat" | "dropReason" | "startDate">>,
  ): Promise<void>;
  upsertCost(cost: Omit<ChannelCost, "id">): Promise<void>;

  /** Para la tarea programada de recordatorios (sin sesión; llave secreta). */
  reminderData(): Promise<Pick<Snapshot, "patients" | "checkins">>;

  /** Datos del paciente con sesión; respetan los permisos por fila. */
  myPatient(userId: string): Promise<Patient | null>;
  myCheckins(userId: string): Promise<Checkin[]>;
  saveMyCheckin(userId: string, patientId: string, input: CheckinInput): Promise<Checkin>;
}
