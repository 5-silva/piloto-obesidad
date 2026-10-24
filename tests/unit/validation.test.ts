import { describe, expect, it } from "vitest";
import { parseCheckinForm, parseCostForm, parseLeadForm, parseScreeningForm } from "@/lib/validation";

function fd(entries: [string, string][]): FormData {
  const f = new FormData();
  for (const [k, v] of entries) f.append(k, v);
  return f;
}

const goodLead: [string, string][] = [
  ["name", "  Mariana López "],
  ["email", "Mariana@Ejemplo.MX"],
  ["phone", "+52 55 1234 5678"],
  ["state", "Jalisco"],
  ["glp1", "actualmente"],
  ["consent", "on"],
  ["website", ""],
  ["utm_source", "instagram<script>"],
  ["ref", "dra-mendoza"],
];

describe("lista de espera", () => {
  it("normaliza datos válidos y limpia la atribución", () => {
    const r = parseLeadForm(fd(goodLead));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data).toMatchObject({
      name: "Mariana López",
      email: "mariana@ejemplo.mx",
      phone: "5512345678",
      utmSource: "instagramscript",
      refCode: "dra-mendoza",
      utmMedium: null,
    });
  });

  it("exige consentimiento y celular válido", () => {
    const r = parseLeadForm(fd(goodLead.filter(([k]) => k !== "consent").map(([k, v]) => [k, k === "phone" ? "123" : v])));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors).sort()).toEqual(["consent", "phone"]);
  });

  it("rechaza envíos de bots que llenan el campo oculto", () => {
    const r = parseLeadForm(fd(goodLead.map(([k, v]) => [k, k === "website" ? "spam.com" : v])));
    expect(r.ok).toBe(false);
  });
});

describe("tamizaje", () => {
  it("acepta respuestas múltiples y campos opcionales vacíos", () => {
    const r = parseScreeningForm(
      fd([
        ["age", "41"],
        ["sex", "mujer"],
        ["height_cm", "162"],
        ["weight_kg", "88.5"],
        ["waist_cm", ""],
        ["comorbidities", "hipertension"],
        ["comorbidities", "sop"],
        ["risk", "vesicula"],
        ["glp1", "por_iniciar"],
        ["health_consent", "on"],
      ]),
    );
    expect(r).toEqual({
      ok: true,
      data: {
        age: 41,
        sex: "mujer",
        heightCm: 162,
        weightKg: 88.5,
        waistCm: null,
        comorbidities: ["hipertension", "sop"],
        riskAnswers: ["vesicula"],
        medications: null,
        glp1: "por_iniciar",
        healthConsent: "on",
      },
    });
  });

  it("sin consentimiento de datos de salud no se guarda", () => {
    const r = parseScreeningForm(
      fd([
        ["age", "41"],
        ["height_cm", "162"],
        ["weight_kg", "88"],
        ["glp1", "no"],
      ]),
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.healthConsent).toMatch(/consentimiento/);
  });

  it("exige contestar las preguntas de seguridad", () => {
    const base: [string, string][] = [
      ["age", "41"],
      ["height_cm", "162"],
      ["weight_kg", "88"],
      ["glp1", "no"],
      ["health_consent", "on"],
    ];
    const none = parseScreeningForm(fd(base));
    expect(none.ok).toBe(false);
    if (!none.ok) expect(none.errors.riskAnswers).toMatch(/Ninguna/);
    expect(parseScreeningForm(fd([...base, ["risk_none", "on"]])).ok).toBe(true);
    expect(parseScreeningForm(fd([...base, ["risk_none", "on"], ["risk", "embarazo"]])).ok).toBe(false);
  });

  it("rechaza opciones inventadas", () => {
    const r = parseScreeningForm(
      fd([
        ["age", "41"],
        ["height_cm", "162"],
        ["weight_kg", "88"],
        ["glp1", "no"],
        ["health_consent", "on"],
        ["risk", "otra"],
      ]),
    );
    expect(r.ok).toBe(false);
  });
});

describe("check-in", () => {
  it("requiere el peso y convierte escalas", () => {
    expect(parseCheckinForm(fd([["mood", "4"]])).ok).toBe(false);
    const r = parseCheckinForm(
      fd([
        ["weight_kg", "84.2"],
        ["mood", "4"],
        ["nausea", "0"],
        ["warning", "vomito"],
      ]),
    );
    expect(r).toMatchObject({ ok: true, data: { weightKg: 84.2, mood: 4, nausea: 0, warningSigns: ["vomito"], note: null } });
  });
});

describe("costos", () => {
  it("valida mes y monto", () => {
    expect(
      parseCostForm(
        fd([
          ["month", "2026-10"],
          ["channel", "Instagram"],
          ["amount_mxn", "3500"],
        ]),
      ),
    ).toMatchObject({
      ok: true,
      data: { month: "2026-10", channel: "instagram", amountMxn: 3500, hours: 0 },
    });
    expect(
      parseCostForm(
        fd([
          ["month", "2026-13"],
          ["channel", "x"],
          ["amount_mxn", "-1"],
        ]),
      ).ok,
    ).toBe(false);
  });
});

describe("números con coma decimal", () => {
  it("acepta «74,5» como 74.5 en el check-in", () => {
    expect(parseCheckinForm(fd([["weight_kg", "74,5"]]))).toMatchObject({ ok: true, data: { weightKg: 74.5 } });
  });
});
