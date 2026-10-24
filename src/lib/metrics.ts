// Métricas del piloto, calculadas a partir de los datos crudos. Son las que
// deciden la semana 16 (HC1–HC8 del market research). Funciones puras: se
// prueban sin base de datos.
import type { AppEvent, Checkin, Lead, Patient, Snapshot } from "@/lib/data/types";
import { daysBetween, monthStart, programWeek, weeksCompleted } from "@/lib/dates";

/** Margen bruto estimado del servicio individual a $2,500 (market research §13). */
export const GROSS_MARGIN = 0.36;

export function channelOf(x: { refCode: string | null; utmSource: string | null }): string {
  if (x.refCode) return "medico";
  return x.utmSource?.trim().toLowerCase() || "directo";
}

export const CHANNEL_LABELS: Record<string, string> = { medico: "Médico", directo: "Directo" };

export function channelLabel(channel: string | null): string {
  if (!channel) return "Directo";
  return CHANNEL_LABELS[channel] ?? channel.charAt(0).toUpperCase() + channel.slice(1);
}

export type Rate = { numerator: number; denominator: number; rate: number | null };

function rate(numerator: number, denominator: number): Rate {
  return { numerator, denominator, rate: denominator > 0 ? numerator / denominator : null };
}

export type HypothesisStatus = "cumple" | "no_cumple" | "sin_datos";
export type Hypothesis = { id: string; label: string; target: string; actual: string; status: HypothesisStatus };

export type Metrics = {
  funnel: { label: string; value: number }[];
  landingConversion: Rate;
  channels: {
    channel: string;
    visitors: number;
    leads: number;
    conversion: number | null;
    patients: number;
    costMxn: number;
    cacMxn: number | null;
  }[];
  retention: { week: number; result: Rate }[];
  digitalCompletion: Rate;
  weeklyCompliance: Rate;
  depositsPaid: number;
  referringDoctors: number;
  cacTargetMxn: number;
  hypotheses: Hypothesis[];
};

function uniqueVisitors(events: AppEvent[]): Map<string, AppEvent> {
  const first = new Map<string, AppEvent>();
  for (const e of events) {
    if (e.name !== "landing_view") continue;
    if (!first.has(e.sessionId)) first.set(e.sessionId, e);
  }
  return first;
}

function maxWeekByPatient(checkins: Checkin[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const c of checkins) out.set(c.patientId, Math.max(out.get(c.patientId) ?? 0, c.week));
  return out;
}

function startedPatients(patients: Patient[], today: string): Patient[] {
  return patients.filter((p) => daysBetween(p.startDate, today) >= 0);
}

export function retentionAt(week: number, patients: Patient[], checkins: Checkin[], today: string): Rate {
  const maxWeek = maxWeekByPatient(checkins);
  const eligible = startedPatients(patients, today).filter((p) => weeksCompleted(p.startDate, today) >= week);
  const retained = eligible.filter((p) => (maxWeek.get(p.id) ?? 0) >= week);
  return rate(retained.length, eligible.length);
}

export function digitalCompletion(patients: Patient[], checkins: Checkin[], today: string): Rate {
  const eligible = startedPatients(patients, today).filter((p) => weeksCompleted(p.startDate, today) >= 4);
  const done = eligible.filter((p) => {
    const weeks = new Set(checkins.filter((c) => c.patientId === p.id).map((c) => c.week));
    const firstFour = [1, 2, 3, 4].filter((w) => weeks.has(w)).length;
    return firstFour >= 3 && [...weeks].some((w) => w >= 4);
  });
  return rate(done.length, eligible.length);
}

export function weeklyCompliance(patients: Patient[], checkins: Checkin[], today: string): Rate {
  const active = startedPatients(patients, today).filter((p) => p.status === "activo");
  const done = active.filter((p) => {
    const week = programWeek(p.startDate, today);
    return checkins.some((c) => c.patientId === p.id && c.week === week);
  });
  return rate(done.length, active.length);
}

function pct(r: number | null): string {
  return r === null ? "sin datos" : `${Math.round(r * 100)}%`;
}

export function computeMetrics(data: Snapshot, today: string, priceMxn: number): Metrics {
  const visitors = uniqueVisitors(data.events);
  const screenedIds = new Set(data.screenings.map((s) => s.leadId));
  const apt = data.screenings.filter((s) => s.result !== "no_elegible").length;
  const scheduled = data.leads.filter((l) => l.status === "agendado" || l.status === "activo").length;
  const active = data.patients.filter((p) => p.status === "activo").length;

  const funnel = [
    { label: "Visitantes únicos", value: visitors.size },
    { label: "Lista de espera", value: data.leads.length },
    { label: "Tamizaje completo", value: data.leads.filter((l) => screenedIds.has(l.id)).length },
    { label: "Aptos o por revisar", value: apt },
    { label: "Valoración agendada", value: scheduled },
    { label: "Pacientes activos", value: active },
  ];

  const channelNames = new Set<string>();
  const visitorsBy = new Map<string, number>();
  for (const e of visitors.values()) {
    const ch = channelOf(e);
    channelNames.add(ch);
    visitorsBy.set(ch, (visitorsBy.get(ch) ?? 0) + 1);
  }
  const leadsBy = new Map<string, number>();
  for (const l of data.leads) {
    const ch = channelOf(l);
    channelNames.add(ch);
    leadsBy.set(ch, (leadsBy.get(ch) ?? 0) + 1);
  }
  const patientsBy = new Map<string, number>();
  for (const p of data.patients) {
    const ch = p.channel || "directo";
    channelNames.add(ch);
    patientsBy.set(ch, (patientsBy.get(ch) ?? 0) + 1);
  }
  const costBy = new Map<string, number>();
  for (const c of data.costs) {
    const ch = c.channel.trim().toLowerCase();
    channelNames.add(ch);
    costBy.set(ch, (costBy.get(ch) ?? 0) + c.amountMxn);
  }
  const channels = [...channelNames]
    .map((channel) => {
      const v = visitorsBy.get(channel) ?? 0;
      const l = leadsBy.get(channel) ?? 0;
      const p = patientsBy.get(channel) ?? 0;
      const cost = costBy.get(channel) ?? 0;
      return {
        channel,
        visitors: v,
        leads: l,
        conversion: v > 0 ? l / v : null,
        patients: p,
        costMxn: cost,
        cacMxn: p > 0 ? cost / p : null,
      };
    })
    .sort((a, b) => b.leads - a.leads || b.visitors - a.visitors);

  const retention = [4, 8, 12].map((week) => ({
    week,
    result: retentionAt(week, data.patients, data.checkins, today),
  }));
  const completion = digitalCompletion(data.patients, data.checkins, today);
  const compliance = weeklyCompliance(data.patients, data.checkins, today);
  const depositsPaid = data.patients.filter((p) => p.deposit === "pagado").length;
  const referringDoctors = new Set(data.leads.map((l) => l.refCode).filter(Boolean)).size;
  const landingConversion = rate(data.leads.length, visitors.size);

  const totalCost = [...costBy.values()].reduce((a, b) => a + b, 0);
  const totalPatients = data.patients.length;
  const overallCac = totalPatients > 0 ? totalCost / totalPatients : null;
  const cacTargetMxn = Math.round(2 * priceMxn * GROSS_MARGIN);
  const r12 = retention[2].result;

  const hypotheses: Hypothesis[] = [
    {
      id: "HC1",
      label: "Pagan el servicio",
      target: "≥ 20 depósitos y conversión ≥ 5%",
      actual: `${depositsPaid} depósitos y conversión de ${pct(landingConversion.rate)}`,
      status:
        landingConversion.rate === null && depositsPaid === 0
          ? "sin_datos"
          : depositsPaid >= 20 && (landingConversion.rate ?? 0) >= 0.05
            ? "cumple"
            : "no_cumple",
    },
    {
      id: "HC3",
      label: "Aceptan el formato digital",
      target: "≥ 70% completa 4 semanas",
      actual: pct(completion.rate),
      status: completion.rate === null ? "sin_datos" : completion.rate >= 0.7 ? "cumple" : "no_cumple",
    },
    {
      id: "HC4",
      label: "El acompañamiento retiene",
      target: "≥ 70% a 12 semanas",
      actual: pct(r12.rate),
      status: r12.rate === null ? "sin_datos" : r12.rate >= 0.7 ? "cumple" : "no_cumple",
    },
    {
      id: "HC5",
      label: "Hay un canal rentable",
      target: `Costo por paciente < $${cacTargetMxn.toLocaleString("es-MX")}`,
      actual: overallCac === null ? "sin datos" : `$${Math.round(overallCac).toLocaleString("es-MX")}`,
      status: overallCac === null ? "sin_datos" : overallCac < cacTargetMxn ? "cumple" : "no_cumple",
    },
    {
      id: "HC8",
      label: "Los médicos refieren",
      target: "≥ 3 médicos con referidos",
      actual: `${referringDoctors}`,
      status: referringDoctors === 0 ? "sin_datos" : referringDoctors >= 3 ? "cumple" : "no_cumple",
    },
  ];

  return {
    funnel,
    landingConversion,
    channels,
    retention,
    digitalCompletion: completion,
    weeklyCompliance: compliance,
    depositsPaid,
    referringDoctors,
    cacTargetMxn,
    hypotheses,
  };
}

export type TodayTasks = {
  newLeads: Lead[];
  toSchedule: Lead[];
  missingCheckin: { patient: Patient; week: number; dayOfWeek: number }[];
  flagged: { patient: Patient; checkin: Checkin }[];
};

/** Lista de trabajo del coordinador para hoy. */
export function todayTasks(data: Snapshot, today: string): TodayTasks {
  const byId = new Map(data.patients.map((p) => [p.id, p]));
  const missingCheckin = data.patients
    .filter((p) => p.status === "activo" && daysBetween(p.startDate, today) >= 0)
    .map((patient) => ({
      patient,
      week: programWeek(patient.startDate, today),
      dayOfWeek: (daysBetween(patient.startDate, today) % 7) + 1,
    }))
    .filter(({ patient, week }) => !data.checkins.some((c) => c.patientId === patient.id && c.week === week))
    .sort((a, b) => b.dayOfWeek - a.dayOfWeek);

  const flagged = data.checkins
    .filter((c) => c.flagged && daysBetween(c.createdAt.slice(0, 10), today) <= 7)
    .flatMap((checkin) => {
      const patient = byId.get(checkin.patientId);
      return patient ? [{ patient, checkin }] : [];
    })
    .sort((a, b) => b.checkin.createdAt.localeCompare(a.checkin.createdAt));

  return {
    newLeads: data.leads.filter((l) => l.status === "nuevo"),
    toSchedule: data.leads.filter((l) => l.status === "elegible" || l.status === "revisar"),
    missingCheckin,
    flagged,
  };
}

export { monthStart };
