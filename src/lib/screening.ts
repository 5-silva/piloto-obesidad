// Reglas de tamizaje previo. No diagnostican ni sustituyen al médico: ordenan
// a quién valorar primero y qué debe revisar el médico aliado en la consulta.
// Contenido clínico pendiente de validación por el médico responsable.

export const COMORBIDITIES = {
  hipertension: "Presión alta (hipertensión)",
  dislipidemia: "Colesterol o triglicéridos altos",
  prediabetes: "Prediabetes o resistencia a la insulina",
  diabetes2: "Diabetes tipo 2",
  higado_graso: "Hígado graso",
  apnea: "Apnea del sueño",
  articular: "Dolor de rodillas o cadera por el peso",
  sop: "Síndrome de ovario poliquístico",
} as const;

export const RISK_QUESTIONS = {
  embarazo: "Estoy embarazada, buscando un embarazo o dando pecho",
  tca: "Tengo o tuve un trastorno de la conducta alimentaria (anorexia, bulimia o atracones)",
  tiroides_medular:
    "Yo o un familiar directo tuvimos cáncer medular de tiroides o síndrome MEN2",
  pancreatitis: "He tenido pancreatitis",
  vesicula: "Tengo piedras en la vesícula",
  diabetes1: "Tengo diabetes tipo 1",
  hipoglucemiantes: "Uso insulina o pastillas que bajan el azúcar (como glibenclamida)",
} as const;

export type Comorbidity = keyof typeof COMORBIDITIES;
export type RiskAnswer = keyof typeof RISK_QUESTIONS;
export type Eligibility = "elegible" | "revisar" | "no_elegible";

export const FLAG_LABELS: Record<string, string> = {
  menor_de_edad: "Menor de 18 años",
  imc_bajo: "IMC menor a 27",
  imc_sin_comorbilidad: "IMC 27–29.9 sin enfermedad asociada",
  imc_40: "IMC de 40 o más: valorar también otras opciones",
  mayor_65: "65 años o más",
  ...Object.fromEntries(Object.entries(RISK_QUESTIONS).map(([k, v]) => [k, v])),
};

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export type ScreeningInput = {
  age: number;
  heightCm: number;
  weightKg: number;
  comorbidities: Comorbidity[];
  riskAnswers: RiskAnswer[];
};

export type ScreeningResult = { bmi: number; result: Eligibility; flags: string[] };

export function evaluateScreening(input: ScreeningInput): ScreeningResult {
  const value = bmi(input.weightKg, input.heightCm);
  const exclusions: string[] = [];
  if (input.age < 18) exclusions.push("menor_de_edad");
  if (value < 27) exclusions.push("imc_bajo");
  else if (value < 30 && input.comorbidities.length === 0) exclusions.push("imc_sin_comorbilidad");
  if (exclusions.length > 0) return { bmi: value, result: "no_elegible", flags: exclusions };

  const flags: string[] = [...input.riskAnswers];
  if (value >= 40) flags.push("imc_40");
  if (input.age >= 65) flags.push("mayor_65");
  return { bmi: value, result: flags.length > 0 ? "revisar" : "elegible", flags };
}
