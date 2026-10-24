import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CheckinInput } from "@/lib/checkin";
import { channelOf } from "@/lib/metrics";
import { adminClient } from "@/lib/supabase/admin";
import { createUserClient } from "@/lib/supabase/server";
import type { AppEvent, ChannelCost, Checkin, Lead, Patient, Repo, Screening } from "./types";

type Row = Record<string, unknown>;

const num = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));
const text = (v: unknown): string | null => (v === null || v === undefined ? null : String(v));

const toLead = (r: Row): Lead => ({
  id: String(r.id),
  createdAt: String(r.created_at),
  name: String(r.name),
  email: String(r.email),
  phone: String(r.phone),
  state: text(r.state),
  glp1: r.glp1 as Lead["glp1"],
  utmSource: text(r.utm_source),
  utmMedium: text(r.utm_medium),
  utmCampaign: text(r.utm_campaign),
  refCode: text(r.ref_code),
  priceShownMxn: num(r.price_shown_mxn),
  status: r.status as Lead["status"],
  screeningToken: String(r.screening_token),
  notes: text(r.notes),
});

const toScreening = (r: Row): Screening => ({
  leadId: String(r.lead_id),
  createdAt: String(r.created_at),
  age: Number(r.age),
  sex: (r.sex as Screening["sex"]) ?? null,
  heightCm: Number(r.height_cm),
  weightKg: Number(r.weight_kg),
  bmi: Number(r.bmi),
  waistCm: num(r.waist_cm),
  comorbidities: (r.comorbidities as string[]) ?? [],
  riskAnswers: (r.risk_answers as string[]) ?? [],
  medications: text(r.medications),
  glp1: r.glp1 as Screening["glp1"],
  result: r.result as Screening["result"],
  flags: (r.flags as string[]) ?? [],
});

const toPatient = (r: Row): Patient => ({
  id: String(r.id),
  leadId: text(r.lead_id),
  userId: text(r.user_id),
  createdAt: String(r.created_at),
  displayName: String(r.display_name),
  email: String(r.email),
  phone: String(r.phone),
  startDate: String(r.start_date),
  status: r.status as Patient["status"],
  programFormat: r.program_format as Patient["programFormat"],
  deposit: r.deposit as Patient["deposit"],
  channel: text(r.channel),
  droppedAt: text(r.dropped_at),
  dropReason: text(r.drop_reason),
});

const toCheckin = (r: Row): Checkin => ({
  id: String(r.id),
  patientId: String(r.patient_id),
  createdAt: String(r.created_at),
  week: Number(r.week),
  weightKg: num(r.weight_kg),
  waistCm: num(r.waist_cm),
  tookDose: (r.took_dose as Checkin["tookDose"]) ?? null,
  nausea: num(r.nausea),
  constipation: num(r.constipation),
  waterLiters: num(r.water_liters),
  strengthSessions: num(r.strength_sessions),
  mood: num(r.mood),
  warningSigns: (r.warning_signs as string[]) ?? [],
  note: text(r.note),
  flagged: Boolean(r.flagged),
});

const toEvent = (r: Row): AppEvent => ({
  createdAt: String(r.created_at),
  name: r.name as AppEvent["name"],
  sessionId: String(r.session_id),
  utmSource: text(r.utm_source),
  utmMedium: text(r.utm_medium),
  utmCampaign: text(r.utm_campaign),
  refCode: text(r.ref_code),
});

const toCost = (r: Row): ChannelCost => ({
  id: String(r.id),
  month: String(r.month),
  channel: String(r.channel),
  amountMxn: Number(r.amount_mxn),
  hours: Number(r.hours),
  note: text(r.note),
});

function checkinRow(input: CheckinInput) {
  return {
    weight_kg: input.weightKg,
    waist_cm: input.waistCm,
    took_dose: input.tookDose,
    nausea: input.nausea,
    constipation: input.constipation,
    water_liters: input.waterLiters,
    strength_sessions: input.strengthSessions,
    mood: input.mood,
    warning_signs: input.warningSigns,
    note: input.note,
  };
}

/** PostgREST devuelve como máximo 1000 filas por consulta: paginamos. */
async function fetchAll(client: SupabaseClient, table: string, columns = "*", order = "created_at"): Promise<Row[]> {
  const out: Row[] = [];
  const size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await client
      .from(table)
      .select(columns)
      .order(order, { ascending: true })
      .range(from, from + size - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...((data ?? []) as unknown as Row[]));
    if (!data || data.length < size) return out;
  }
}

function must<T>(res: { data: T; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`${what}: ${res.error.message}`);
  return res.data;
}

/** Busca o crea la cuenta de acceso del paciente (inicia sesión con código por correo). */
async function ensureAuthUser(email: string): Promise<string> {
  const admin = adminClient();
  const created = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (created.data.user) return created.data.user.id;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`auth: ${error.message}`);
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found.id;
    if (data.users.length < 200) break;
  }
  throw new Error(`auth: ${created.error?.message ?? "no se pudo crear la cuenta"}`);
}

export function supabaseRepo(): Repo {
  return {
    // --- Escrituras públicas: validadas en el servidor, con la llave secreta ---
    async createLead(input) {
      const res = await adminClient()
        .from("leads")
        .insert({
          name: input.name,
          email: input.email,
          phone: input.phone,
          state: input.state,
          glp1: input.glp1,
          utm_source: input.utmSource,
          utm_medium: input.utmMedium,
          utm_campaign: input.utmCampaign,
          ref_code: input.refCode,
          price_shown_mxn: input.priceShownMxn,
          privacy_version: input.privacyVersion,
        })
        .select("id, screening_token")
        .single();
      const row = must(res, "leads") as Row;
      return { id: String(row.id), screeningToken: String(row.screening_token) };
    },

    async recordEvent(e) {
      const res = await adminClient().from("events").insert({
        name: e.name,
        session_id: e.sessionId,
        utm_source: e.utmSource,
        utm_medium: e.utmMedium,
        utm_campaign: e.utmCampaign,
        ref_code: e.refCode,
      });
      must(res, "events");
    },

    async getLeadByToken(token) {
      const res = await adminClient().from("leads").select("*").eq("screening_token", token).maybeSingle();
      const row = must(res, "leads") as Row | null;
      return row ? toLead(row) : null;
    },

    async saveScreening(leadId, s) {
      const admin = adminClient();
      must(
        await admin.from("screenings").insert({
          lead_id: leadId,
          age: s.age,
          sex: s.sex,
          height_cm: s.heightCm,
          weight_kg: s.weightKg,
          bmi: s.bmi,
          waist_cm: s.waistCm,
          comorbidities: s.comorbidities,
          risk_answers: s.riskAnswers,
          medications: s.medications,
          glp1: s.glp1,
          result: s.result,
          flags: s.flags,
        }),
        "screenings",
      );
      must(await admin.from("leads").update({ status: s.result }).eq("id", leadId), "leads");
    },

    // --- Equipo: sesión del usuario, RLS exige rol de staff ---
    async snapshot() {
      const db = await createUserClient();
      const [leads, screenings, patients, checkins, events, costs] = await Promise.all([
        fetchAll(db, "leads"),
        fetchAll(db, "screenings"),
        fetchAll(db, "patients"),
        fetchAll(db, "checkins"),
        fetchAll(db, "events", "created_at, name, session_id, utm_source, utm_medium, utm_campaign, ref_code"),
        fetchAll(db, "channel_costs", "*", "month"),
      ]);
      return {
        leads: leads.map(toLead),
        screenings: screenings.map(toScreening),
        patients: patients.map(toPatient),
        checkins: checkins.map(toCheckin),
        events: events.map(toEvent),
        costs: costs.map(toCost),
      };
    },

    async updateLead(id, patch) {
      const db = await createUserClient();
      must(await db.from("leads").update(patch).eq("id", id), "leads");
    },

    async activatePatient(leadId, opts) {
      const db = await createUserClient();
      const existing = must(await db.from("patients").select("*").eq("lead_id", leadId).maybeSingle(), "patients");
      if (existing) return toPatient(existing as Row);
      const lead = must(await db.from("leads").select("*").eq("id", leadId).single(), "leads") as Row;
      const l = toLead(lead);
      const userId = await ensureAuthUser(l.email);
      const row = must(
        await db
          .from("patients")
          .insert({
            lead_id: l.id,
            user_id: userId,
            display_name: l.name,
            email: l.email,
            phone: l.phone,
            start_date: opts.startDate,
            program_format: opts.programFormat,
            channel: channelOf(l),
          })
          .select("*")
          .single(),
        "patients",
      ) as Row;
      must(await db.from("leads").update({ status: "activo" }).eq("id", l.id), "leads");
      return toPatient(row);
    },

    async updatePatient(id, patch) {
      const db = await createUserClient();
      const row: Row = {};
      if (patch.status !== undefined) {
        row.status = patch.status;
        row.dropped_at = patch.status === "baja" ? new Date().toISOString().slice(0, 10) : null;
        if (patch.status !== "baja") row.drop_reason = null;
      }
      if (patch.deposit !== undefined) row.deposit = patch.deposit;
      if (patch.programFormat !== undefined) row.program_format = patch.programFormat;
      if (patch.dropReason !== undefined) row.drop_reason = patch.dropReason;
      if (patch.startDate !== undefined) row.start_date = patch.startDate;
      must(await db.from("patients").update(row).eq("id", id), "patients");
    },

    async upsertCost(cost) {
      const db = await createUserClient();
      must(
        await db.from("channel_costs").upsert(
          { month: cost.month, channel: cost.channel, amount_mxn: cost.amountMxn, hours: cost.hours, note: cost.note },
          { onConflict: "month,channel" },
        ),
        "channel_costs",
      );
    },

    async reminderData() {
      const admin = adminClient();
      const patients = must(await admin.from("patients").select("*").eq("status", "activo"), "patients") as Row[];
      const ids = patients.map((p) => String(p.id));
      if (ids.length === 0) return { patients: [], checkins: [] };
      const checkins = must(
        await admin.from("checkins").select("*").in("patient_id", ids).gte("created_at", new Date(Date.now() - 15 * 86_400_000).toISOString()),
        "checkins",
      ) as Row[];
      return { patients: patients.map(toPatient), checkins: checkins.map(toCheckin) };
    },

    // --- Paciente: sesión del usuario, RLS limita a sus propias filas ---
    async myPatient(userId) {
      const db = await createUserClient();
      const row = must(await db.from("patients").select("*").eq("user_id", userId).maybeSingle(), "patients");
      return row ? toPatient(row as Row) : null;
    },

    async myCheckins(userId) {
      const db = await createUserClient();
      const p = await this.myPatient(userId);
      if (!p) return [];
      const rows = must(
        await db.from("checkins").select("*").eq("patient_id", p.id).order("week", { ascending: true }),
        "checkins",
      ) as Row[];
      return rows.map(toCheckin);
    },

    async saveMyCheckin(_userId, patientId, input) {
      const db = await createUserClient();
      // La base fija la semana y la alerta; el 1 es un marcador que el trigger reemplaza.
      const row = must(
        await db
          .from("checkins")
          .upsert({ patient_id: patientId, week: 1, ...checkinRow(input) }, { onConflict: "patient_id,week" })
          .select("*")
          .single(),
        "checkins",
      ) as Row;
      return toCheckin(row);
    },
  };
}
