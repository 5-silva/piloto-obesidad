import { describe, expect, it } from "vitest";
import { formatMxPhone, normalizeMxPhone } from "@/lib/phone";
import { addDays, daysBetween, nextMonday, programWeek, todayMx, weeksCompleted } from "@/lib/dates";
import { bmi, evaluateScreening } from "@/lib/screening";
import { guidanceFor, isFlagged } from "@/lib/checkin";
import { waLink } from "@/lib/whatsapp";

describe("teléfono", () => {
  it("acepta formatos comunes de celular mexicano", () => {
    expect(normalizeMxPhone("55 1234 5678")).toBe("5512345678");
    expect(normalizeMxPhone("+52 1 55 1234-5678")).toBe("5512345678");
    expect(normalizeMxPhone("525512345678")).toBe("5512345678");
    expect(normalizeMxPhone("12345")).toBeNull();
    expect(formatMxPhone("5512345678")).toBe("55 1234 5678");
  });
});

describe("fechas en hora de CDMX", () => {
  it("cambia de día a medianoche de México, no de UTC", () => {
    // 23 oct 2026, 23:30 en CDMX = 24 oct 05:30 UTC
    expect(todayMx(new Date("2026-10-24T05:30:00Z"))).toBe("2026-10-23");
    expect(todayMx(new Date("2026-10-24T06:30:00Z"))).toBe("2026-10-24");
  });

  it("cuenta semanas del programa igual que la base", () => {
    expect(programWeek("2026-10-01", "2026-10-01")).toBe(1);
    expect(programWeek("2026-10-01", "2026-10-07")).toBe(1);
    expect(programWeek("2026-10-01", "2026-10-08")).toBe(2);
    expect(programWeek("2026-10-10", "2026-10-01")).toBe(1);
    expect(weeksCompleted("2026-10-01", "2026-10-29")).toBe(4);
    expect(daysBetween("2026-02-27", addDays("2026-02-27", 3))).toBe(3);
    expect(nextMonday("2026-10-24")).toBe("2026-10-26"); // sábado
    expect(nextMonday("2026-10-26")).toBe("2026-10-26"); // lunes
  });
});

describe("tamizaje", () => {
  const base = { age: 40, heightCm: 165, weightKg: 90, comorbidities: [], riskAnswers: [] } as const;

  it("calcula el IMC con un decimal", () => {
    expect(bmi(90, 165)).toBe(33.1);
  });

  it("IMC ≥ 30 sin riesgos es apto", () => {
    expect(evaluateScreening({ ...base, comorbidities: [], riskAnswers: [] })).toEqual({
      bmi: 33.1,
      result: "elegible",
      flags: [],
    });
  });

  it("IMC 27–29.9 requiere una enfermedad asociada", () => {
    const w = 78; // IMC 28.7
    expect(evaluateScreening({ ...base, weightKg: w, comorbidities: [], riskAnswers: [] }).result).toBe("no_elegible");
    expect(evaluateScreening({ ...base, weightKg: w, comorbidities: ["hipertension"], riskAnswers: [] }).result).toBe("elegible");
  });

  it("menores de edad e IMC bajo no son aptos", () => {
    expect(evaluateScreening({ ...base, age: 17, comorbidities: [], riskAnswers: [] }).flags).toContain("menor_de_edad");
    expect(evaluateScreening({ ...base, weightKg: 60, comorbidities: [], riskAnswers: [] }).flags).toContain("imc_bajo");
  });

  it("cualquier respuesta de riesgo manda a revisión médica", () => {
    const r = evaluateScreening({ ...base, comorbidities: [], riskAnswers: ["embarazo"] });
    expect(r.result).toBe("revisar");
    expect(r.flags).toEqual(["embarazo"]);
    expect(evaluateScreening({ ...base, weightKg: 115, comorbidities: [], riskAnswers: [] }).flags).toContain("imc_40");
    expect(evaluateScreening({ ...base, age: 70, comorbidities: [], riskAnswers: [] }).flags).toContain("mayor_65");
  });
});

describe("check-in", () => {
  it("alerta con señales de alarma, ánimo muy bajo o náusea fuerte", () => {
    expect(isFlagged({ warningSigns: [], mood: 3, nausea: 1 })).toBe(false);
    expect(isFlagged({ warningSigns: ["vomito"], mood: 4, nausea: 0 })).toBe(true);
    expect(isFlagged({ warningSigns: [], mood: 1, nausea: 0 })).toBe(true);
    expect(isFlagged({ warningSigns: [], mood: null, nausea: 3 })).toBe(true);
  });

  it("prioriza el mensaje urgente", () => {
    expect(guidanceFor({ warningSigns: ["vomito"], mood: 1, nausea: 3 })).toBe("urgente");
    expect(guidanceFor({ warningSigns: [], mood: 1, nausea: 3 })).toBe("animo");
    expect(guidanceFor({ warningSigns: [], mood: 4, nausea: 3 })).toBe("sintomas");
    expect(guidanceFor({ warningSigns: [], mood: 4, nausea: 0 })).toBe("normal");
  });
});

describe("whatsapp", () => {
  it("arma el enlace con lada de México y texto codificado", () => {
    expect(waLink("5512345678", "Hola, ¿cómo estás?")).toBe(
      "https://wa.me/525512345678?text=Hola%2C%20%C2%BFc%C3%B3mo%20est%C3%A1s%3F",
    );
  });
});
