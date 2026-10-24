// Repositorio en memoria para el modo demo y las pruebas. Reproduce las reglas
// de la base (semana y alerta del check-in, permisos del paciente) para que la
// demo se comporte como el piloto real. Los datos de ejemplo son ficticios.
import { randomBytes, randomUUID } from "node:crypto";
import { isFlagged, type CheckinInput } from "@/lib/checkin";
import { addDays, daysBetween, programWeek, todayMx } from "@/lib/dates";
import { channelOf } from "@/lib/metrics";
import { evaluateScreening, type Comorbidity, type RiskAnswer } from "@/lib/screening";
import type {
  AppEvent,
  ChannelCost,
  Checkin,
  Glp1Status,
  Lead,
  LeadStatus,
  Patient,
  Repo,
  Screening,
  Snapshot,
} from "./types";

export const DEMO_STAFF_USER = "00000000-0000-4000-8000-00000000d001";
export const DEMO_PATIENT_USER = "00000000-0000-4000-8000-00000000d002";
export const DEMO_PATIENT_ID = "00000000-0000-4000-8000-00000000d003";

type Store = Snapshot;

function token(): string {
  return randomBytes(32).toString("hex");
}

/** Generador pseudoaleatorio con semilla: la demo se ve igual en cada arranque. */
function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Ana", "Mariana", "Lucía", "Fernanda", "Gabriela", "Claudia", "Patricia", "Sofía", "Rosa", "Verónica", "Daniela", "Alejandra", "Carlos", "Jorge", "Ricardo", "Miguel", "Luis", "Eduardo"];
const LAST = ["Hernández", "García", "Martínez", "López", "González", "Rodríguez", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Cruz", "Morales"];
const STATES = ["Ciudad de México", "Estado de México", "Jalisco", "Nuevo León", "Puebla", "Querétaro", "Guanajuato", "Yucatán"];
const CHANNELS: { source: string | null; ref: string | null; weight: number }[] = [
  { source: "instagram", ref: null, weight: 0.38 },
  { source: "facebook", ref: null, weight: 0.2 },
  { source: null, ref: "dra-mendoza", weight: 0.08 },
  { source: null, ref: "dr-aguilar", weight: 0.06 },
  { source: "google", ref: null, weight: 0.1 },
  { source: null, ref: null, weight: 0.18 },
];

function iso(date: string, rand: () => number): string {
  const h = 8 + Math.floor(rand() * 14);
  const m = Math.floor(rand() * 60);
  return `${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00.000-06:00`;
}

export function seed(today: string = todayMx()): Store {
  const rand = prng(20261024);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
  const pickChannel = () => {
    let r = rand();
    for (const c of CHANNELS) {
      if ((r -= c.weight) <= 0) return c;
    }
    return CHANNELS[CHANNELS.length - 1];
  };

  const events: AppEvent[] = [];
  const leads: Lead[] = [];
  const screenings: Screening[] = [];

  // Seis semanas de tráfico a la landing.
  for (let d = 42; d >= 0; d--) {
    const date = addDays(today, -d);
    const visits = 14 + Math.floor(rand() * 18);
    for (let i = 0; i < visits; i++) {
      const ch = pickChannel();
      const base = {
        sessionId: randomUUID(),
        utmSource: ch.source,
        utmMedium: ch.source === "instagram" || ch.source === "facebook" ? "paid" : null,
        utmCampaign: ch.source ? "fundadores" : null,
        refCode: ch.ref,
      };
      const createdAt = iso(date, rand);
      events.push({ ...base, name: "landing_view", createdAt });
      const conv = ch.ref ? 0.2 : ch.source === "google" ? 0.07 : 0.045;
      if (rand() < conv * 2.2) events.push({ ...base, name: "cta_click", createdAt });
      if (rand() < conv) {
        events.push({ ...base, name: "waitlist_submit", createdAt });
        const name = `${pick(FIRST)} ${pick(LAST)}`;
        leads.push({
          id: randomUUID(),
          createdAt,
          name,
          email: `${name.split(" ")[0].toLowerCase()}.${leads.length + 1}@ejemplo.mx`,
          phone: `55${String(10000000 + Math.floor(rand() * 89999999))}`,
          state: pick(STATES),
          glp1: pick<Glp1Status>(["actualmente", "actualmente", "por_iniciar", "no", "no_se"]),
          utmSource: base.utmSource,
          utmMedium: base.utmMedium,
          utmCampaign: base.utmCampaign,
          refCode: base.refCode,
          priceShownMxn: 2500,
          status: "nuevo",
          screeningToken: token(),
          notes: null,
        });
      }
    }
  }

  // Avance de cada lead por el embudo: los más antiguos llegaron más lejos.
  const comorbidityPool: Comorbidity[] = ["hipertension", "dislipidemia", "prediabetes", "higado_graso", "articular", "sop"];
  for (const lead of leads) {
    const age = daysBetween(lead.createdAt.slice(0, 10), today);
    const r = rand();
    if (age < 3 && r < 0.85) continue;
    if (r < 0.12) {
      lead.status = "contactado";
      continue;
    }
    if (r < 0.25) {
      lead.status = "tamizaje_enviado";
      continue;
    }
    const heightCm = 152 + Math.floor(rand() * 30);
    const bmiTarget = 26 + rand() * 14;
    const weightKg = Math.round(bmiTarget * (heightCm / 100) ** 2 * 10) / 10;
    const comorbidities = comorbidityPool.filter(() => rand() < 0.3);
    const riskAnswers: RiskAnswer[] = rand() < 0.12 ? ["vesicula"] : [];
    const patientAge = 24 + Math.floor(rand() * 40);
    const result = evaluateScreening({ age: patientAge, heightCm, weightKg, comorbidities, riskAnswers });
    screenings.push({
      leadId: lead.id,
      createdAt: lead.createdAt,
      age: patientAge,
      sex: rand() < 0.78 ? "mujer" : "hombre",
      heightCm,
      weightKg,
      bmi: result.bmi,
      waistCm: Math.round(80 + rand() * 40),
      comorbidities,
      riskAnswers,
      medications: null,
      glp1: lead.glp1,
      result: result.result,
      flags: result.flags,
    });
    lead.status = result.result;
    if (result.result !== "no_elegible" && age > 5 && rand() < 0.75) lead.status = "agendado";
  }

  // Pacientes activos: cohortes que arrancaron en distintas semanas.
  const patients: Patient[] = [];
  const checkins: Checkin[] = [];
  const candidates = leads.filter((l) => l.status === "agendado").slice(0, 14);
  const starts = [38, 93, 86, 84, 79, 71, 66, 58, 51, 45, 30, 25, 16, 11];
  candidates.forEach((lead, i) => {
    const startDate = addDays(today, -(starts[i] ?? 7));
    lead.status = "activo";
    const s = screenings.find((x) => x.leadId === lead.id);
    const dropped = i === 2 || i === 6;
    const patient: Patient = {
      id: i === 0 ? DEMO_PATIENT_ID : randomUUID(),
      leadId: lead.id,
      userId: i === 0 ? DEMO_PATIENT_USER : null,
      createdAt: `${startDate}T10:00:00.000-06:00`,
      displayName: i === 0 ? "Ana (paciente de ejemplo)" : lead.name,
      email: i === 0 ? "ana@ejemplo.mx" : lead.email,
      phone: lead.phone,
      startDate,
      status: dropped ? "baja" : "activo",
      programFormat: i % 4 === 3 ? "grupal" : "individual",
      deposit: i < 9 ? "pagado" : i < 12 ? "pendiente" : "ninguno",
      channel: channelOf(lead),
      droppedAt: dropped ? addDays(startDate, 30) : null,
      dropReason: dropped ? (i === 2 ? "Costo del medicamento" : "No le acomodó el horario") : null,
    };
    patients.push(patient);

    const weeksSoFar = programWeek(startDate, today);
    const lastWeek = dropped ? 4 : weeksSoFar;
    let weight = s?.weightKg ?? 88;
    for (let w = 1; w <= lastWeek; w++) {
      const isCurrent = w === weeksSoFar;
      if (isCurrent && (i === 0 || rand() < 0.45)) continue; // aún no registra esta semana
      if (!isCurrent && rand() < 0.1) continue; // semana perdida
      weight = Math.round((weight * (1 - (0.004 + rand() * 0.009))) * 10) / 10;
      const nausea = w <= 4 ? Math.floor(rand() * 3) : Math.floor(rand() * 2);
      const mood = 2 + Math.floor(rand() * 4);
      const recentFlag = i === 4 && isCurrent;
      const input: CheckinInput = {
        weightKg: weight,
        waistCm: null,
        tookDose: lead.glp1 === "no" ? "no_aplica" : rand() < 0.9 ? "si" : "no",
        nausea: recentFlag ? 3 : nausea,
        constipation: Math.floor(rand() * 3),
        waterLiters: Math.round((1.2 + rand() * 1.5) * 10) / 10,
        strengthSessions: Math.floor(rand() * 4),
        mood: i === 9 && isCurrent ? 1 : mood,
        warningSigns: [],
        note: recentFlag ? "Esta semana me sentí con mucho asco después de la dosis." : null,
      };
      checkins.push({
        id: randomUUID(),
        patientId: patient.id,
        createdAt: iso(addDays(startDate, (w - 1) * 7 + Math.floor(rand() * 4)), rand),
        week: w,
        ...input,
        flagged: isFlagged(input),
      });
    }
  });

  const month = today.slice(0, 7);
  const prev = addDays(`${month}-01`, -1).slice(0, 7);
  const costs: ChannelCost[] = [
    { id: randomUUID(), month: `${prev}-01`, channel: "instagram", amountMxn: 4200, hours: 6, note: "Anuncios lista de espera" },
    { id: randomUUID(), month: `${prev}-01`, channel: "facebook", amountMxn: 1800, hours: 2, note: null },
    { id: randomUUID(), month: `${prev}-01`, channel: "medico", amountMxn: 900, hours: 14, note: "Visitas a consultorios" },
    { id: randomUUID(), month: `${month}-01`, channel: "instagram", amountMxn: 3600, hours: 5, note: null },
    { id: randomUUID(), month: `${month}-01`, channel: "google", amountMxn: 1500, hours: 2, note: "Prueba de búsqueda" },
    { id: randomUUID(), month: `${month}-01`, channel: "medico", amountMxn: 600, hours: 10, note: null },
  ];

  return { leads, screenings, patients, checkins, events, costs };
}

const globalStore = globalThis as unknown as { __demoStore?: Store };

function store(): Store {
  globalStore.__demoStore ??= seed();
  return globalStore.__demoStore;
}

/** Repositorio en memoria. `data` permite inyectar datos en pruebas. */
export function memoryRepo(data?: Store, today: () => string = todayMx): Repo {
  const db = () => data ?? store();
  const clone = <T,>(x: T): T => structuredClone(x);

  return {
    async createLead(input) {
      const lead: Lead = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        name: input.name,
        email: input.email,
        phone: input.phone,
        state: input.state,
        glp1: input.glp1,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        refCode: input.refCode,
        priceShownMxn: input.priceShownMxn,
        status: "nuevo",
        screeningToken: token(),
        notes: null,
      };
      db().leads.push(lead);
      return { id: lead.id, screeningToken: lead.screeningToken };
    },

    async recordEvent(event) {
      db().events.push({ ...event, createdAt: new Date().toISOString() });
    },

    async getLeadByToken(t) {
      const lead = db().leads.find((l) => l.screeningToken === t);
      return lead ? clone(lead) : null;
    },

    async saveScreening(leadId, s) {
      const d = db();
      if (d.screenings.some((x) => x.leadId === leadId)) throw new Error("tamizaje_duplicado");
      d.screenings.push({ ...s, leadId, createdAt: new Date().toISOString() });
      const lead = d.leads.find((l) => l.id === leadId);
      if (lead) lead.status = s.result;
    },

    async snapshot() {
      return clone(db());
    },

    async updateLead(id, patch) {
      const lead = db().leads.find((l) => l.id === id);
      if (!lead) throw new Error("lead_inexistente");
      if (patch.status !== undefined) lead.status = patch.status as LeadStatus;
      if (patch.notes !== undefined) lead.notes = patch.notes;
    },

    async activatePatient(leadId, opts) {
      const d = db();
      const existing = d.patients.find((p) => p.leadId === leadId);
      if (existing) return clone(existing);
      const lead = d.leads.find((l) => l.id === leadId);
      if (!lead) throw new Error("lead_inexistente");
      const patient: Patient = {
        id: randomUUID(),
        leadId,
        userId: randomUUID(),
        createdAt: new Date().toISOString(),
        displayName: lead.name,
        email: lead.email,
        phone: lead.phone,
        startDate: opts.startDate,
        status: "activo",
        programFormat: opts.programFormat,
        deposit: "ninguno",
        channel: channelOf(lead),
        droppedAt: null,
        dropReason: null,
      };
      d.patients.push(patient);
      lead.status = "activo";
      return clone(patient);
    },

    async updatePatient(id, patch) {
      const p = db().patients.find((x) => x.id === id);
      if (!p) throw new Error("paciente_inexistente");
      Object.assign(p, patch);
      if (patch.status === "baja" && !p.droppedAt) p.droppedAt = today();
      if (patch.status && patch.status !== "baja") {
        p.droppedAt = null;
        p.dropReason = patch.dropReason ?? null;
      }
    },

    async upsertCost(cost) {
      const d = db();
      const existing = d.costs.find((c) => c.month === cost.month && c.channel === cost.channel);
      if (existing) Object.assign(existing, cost);
      else d.costs.push({ ...cost, id: randomUUID() });
    },

    async reminderData() {
      const d = db();
      return clone({ patients: d.patients.filter((p) => p.status === "activo"), checkins: d.checkins });
    },

    async myPatient(userId) {
      const p = db().patients.find((x) => x.userId === userId);
      return p ? clone(p) : null;
    },

    async myCheckins(userId) {
      const p = db().patients.find((x) => x.userId === userId);
      if (!p) return [];
      return clone(db().checkins.filter((c) => c.patientId === p.id).sort((a, b) => a.week - b.week));
    },

    async saveMyCheckin(userId, patientId, input) {
      const d = db();
      const p = d.patients.find((x) => x.id === patientId && x.userId === userId);
      if (!p || p.status !== "activo") throw new Error("sin_permiso");
      const week = programWeek(p.startDate, today());
      const flagged = isFlagged(input);
      const existing = d.checkins.find((c) => c.patientId === p.id && c.week === week);
      if (existing) {
        Object.assign(existing, input, { flagged });
        return clone(existing);
      }
      const row: Checkin = {
        id: randomUUID(),
        patientId: p.id,
        createdAt: new Date().toISOString(),
        week,
        ...input,
        flagged,
      };
      d.checkins.push(row);
      return clone(row);
    },
  };
}
