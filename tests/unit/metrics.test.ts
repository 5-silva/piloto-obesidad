import { describe, expect, it } from "vitest";
import { addDays } from "@/lib/dates";
import { computeMetrics, retentionAt, todayTasks } from "@/lib/metrics";
import { memoryRepo, seed } from "@/lib/data/memory";
import type { Checkin, Patient, Snapshot } from "@/lib/data/types";

const TODAY = "2026-10-24";

function patient(id: string, startDaysAgo: number, extra: Partial<Patient> = {}): Patient {
  return {
    id,
    leadId: null,
    userId: `u-${id}`,
    createdAt: `${addDays(TODAY, -startDaysAgo)}T10:00:00Z`,
    displayName: id,
    email: `${id}@ejemplo.mx`,
    phone: "5512345678",
    startDate: addDays(TODAY, -startDaysAgo),
    status: "activo",
    programFormat: "individual",
    deposit: "ninguno",
    channel: "instagram",
    droppedAt: null,
    dropReason: null,
    ...extra,
  };
}

function checkin(patientId: string, week: number, extra: Partial<Checkin> = {}): Checkin {
  return {
    id: `${patientId}-${week}`,
    patientId,
    createdAt: `${TODAY}T10:00:00Z`,
    week,
    weightKg: 80,
    waistCm: null,
    tookDose: "si",
    nausea: 0,
    constipation: 0,
    waterLiters: 2,
    strengthSessions: 1,
    mood: 4,
    warningSigns: [],
    note: null,
    flagged: false,
    ...extra,
  };
}

describe("retención", () => {
  it("solo cuenta a quienes ya llevan k semanas y siguen registrando", () => {
    const patients = [patient("a", 30), patient("b", 30), patient("c", 10)];
    const checkins = [checkin("a", 4), checkin("a", 5), checkin("b", 2), checkin("c", 2)];
    expect(retentionAt(4, patients, checkins, TODAY)).toEqual({ numerator: 1, denominator: 2, rate: 0.5 });
    expect(retentionAt(12, patients, checkins, TODAY).rate).toBeNull();
  });
});

describe("métricas del piloto", () => {
  const data: Snapshot = {
    leads: [],
    screenings: [],
    patients: [patient("a", 30, { deposit: "pagado" }), patient("b", 3)],
    checkins: [checkin("a", 1), checkin("a", 2), checkin("a", 3), checkin("a", 4), checkin("a", 5), checkin("b", 1)],
    events: [
      {
        createdAt: TODAY,
        name: "landing_view",
        sessionId: "s1",
        utmSource: "instagram",
        utmMedium: null,
        utmCampaign: null,
        refCode: null,
      },
      {
        createdAt: TODAY,
        name: "landing_view",
        sessionId: "s1",
        utmSource: "instagram",
        utmMedium: null,
        utmCampaign: null,
        refCode: null,
      },
      {
        createdAt: TODAY,
        name: "landing_view",
        sessionId: "s2",
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        refCode: "dr-x",
      },
    ],
    costs: [{ id: "c1", month: "2026-10-01", channel: "Instagram", amountMxn: 1000, hours: 2, note: null }],
  };

  it("cuenta visitantes únicos y atribuye canal médico por código", () => {
    const m = computeMetrics(data, TODAY, 2500);
    expect(m.funnel[0]).toEqual({ label: "Visitantes únicos", value: 2 });
    const channels = Object.fromEntries(m.channels.map((c) => [c.channel, c]));
    expect(channels.instagram).toMatchObject({ visitors: 1, patients: 2, costMxn: 1000, cacMxn: 500 });
    expect(channels.medico).toMatchObject({ visitors: 1 });
  });

  it("evalúa las hipótesis con sus umbrales", () => {
    const m = computeMetrics(data, TODAY, 2500);
    const h = Object.fromEntries(m.hypotheses.map((x) => [x.id, x]));
    expect(m.cacTargetMxn).toBe(1800);
    expect(h.HC5.status).toBe("cumple");
    expect(h.HC3).toMatchObject({ actual: "100%", status: "cumple" });
    expect(h.HC4.status).toBe("sin_datos");
    expect(m.weeklyCompliance).toEqual({ numerator: 2, denominator: 2, rate: 1 });
  });

  it("arma la lista de hoy con pendientes y alertas recientes", () => {
    const d: Snapshot = {
      ...data,
      checkins: [...data.checkins.filter((c) => c.patientId !== "b"), checkin("a", 5, { flagged: true, mood: 1 })],
    };
    const t = todayTasks(d, TODAY);
    expect(t.missingCheckin.map((x) => x.patient.id)).toEqual(["b"]);
    expect(t.flagged).toHaveLength(1);
  });
});

describe("repositorio de demo", () => {
  it("genera datos de ejemplo coherentes", () => {
    const s = seed(TODAY);
    expect(s.leads.length).toBeGreaterThan(30);
    expect(s.patients.length).toBeGreaterThan(8);
    for (const c of s.checkins) {
      const p = s.patients.find((x) => x.id === c.patientId)!;
      expect(c.week).toBeLessThanOrEqual(Math.floor((Date.parse(TODAY) - Date.parse(p.startDate)) / 86400000 / 7) + 1);
    }
    const m = computeMetrics(s, TODAY, 2500);
    expect(m.retention[0].result.denominator).toBeGreaterThan(0);
  });

  it("el paciente solo registra su semana actual y no la de otros", async () => {
    const s = seed(TODAY);
    const repo = memoryRepo(s, () => TODAY);
    const [p, other] = s.patients.filter((x) => x.status === "activo");
    p.userId = "yo";
    const input = {
      weightKg: 79,
      waistCm: null,
      tookDose: "si" as const,
      nausea: 0,
      constipation: 0,
      waterLiters: 2,
      strengthSessions: 1,
      mood: 4,
      warningSigns: [],
      note: null,
    };
    const saved = await repo.saveMyCheckin("yo", p.id, input);
    const again = await repo.saveMyCheckin("yo", p.id, { ...input, weightKg: 78.5 });
    expect(again.id).toBe(saved.id);
    expect(again.weightKg).toBe(78.5);
    await expect(repo.saveMyCheckin("yo", other.id, input)).rejects.toThrow("sin_permiso");
  });

  it("al activar un lead crea al paciente una sola vez", async () => {
    const s = seed(TODAY);
    const repo = memoryRepo(s, () => TODAY);
    const lead = s.leads.find((l) => l.status === "elegible" || l.status === "revisar" || l.status === "agendado")!;
    const a = await repo.activatePatient(lead.id, { startDate: TODAY, programFormat: "individual" });
    const b = await repo.activatePatient(lead.id, { startDate: TODAY, programFormat: "grupal" });
    expect(b.id).toBe(a.id);
    expect(s.leads.find((l) => l.id === lead.id)!.status).toBe("activo");
  });
});

describe("recordatorios", async () => {
  const { dueReminders } = await import("@/lib/reminders");
  it("avisa el día 1 y el día 5 solo si falta el check-in", () => {
    const day1 = patient("d1", 14); // día 1 de la semana 3
    const day5 = patient("d5", 11); // día 5 de la semana 2
    const day3 = patient("d3", 9); // día 3: no toca
    const done = patient("ok", 14);
    const paused = patient("p", 14, { status: "pausa" });
    const r = dueReminders([day1, day5, day3, done, paused], [checkin("ok", 3)], TODAY);
    expect(r.map((x) => [x.patient.id, x.week, x.late])).toEqual([
      ["d1", 3, false],
      ["d5", 2, true],
    ]);
  });
});
