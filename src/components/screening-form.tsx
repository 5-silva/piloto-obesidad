"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { submitScreening, type ScreeningState } from "@/app/actions/screening";
import { submitWithoutReset, useReveal } from "@/components/form-utils";
import { ChoiceCard, Segmented } from "@/components/ui/choice";
import { describe, Field, FieldError, Input, Textarea } from "@/components/ui/field";
import { check, FormSteps, type FormStep } from "@/components/ui/form-steps";
import { Icon } from "@/components/ui/icon";
import { Tile } from "@/components/ui/surface";
import { site } from "@/lib/config";
import { bmi, COMORBIDITIES, RISK_QUESTIONS } from "@/lib/screening";

const GLP1_OPTIONS = [
  ["actualmente", "Sí, ya lo uso"],
  ["por_iniciar", "Lo voy a iniciar"],
  ["no", "No"],
  ["no_se", "No estoy seguro"],
] as const;

const NOT_ELIGIBLE_COPY: Record<string, (bmi: number) => string> = {
  menor_de_edad: () => "El programa es solo para personas de 18 años o más.",
  imc_bajo: (v) =>
    `Con la estatura y el peso que nos diste, tu IMC es ${v}. Los tratamientos que acompañamos se indican a partir de un IMC de 27 con alguna enfermedad relacionada, o de 30.`,
  imc_sin_comorbilidad: (v) =>
    `Tu IMC es ${v}. Entre 27 y 29.9 el tratamiento se indica cuando también hay una enfermedad relacionada, como presión alta o prediabetes. Si tienes alguna y no la marcaste, escríbenos.`,
};

const FIELD_STEP: Record<string, number> = {
  age: 0,
  heightCm: 0,
  weightKg: 0,
  waistCm: 0,
  comorbidities: 1,
  riskAnswers: 2,
  glp1: 3,
  medications: 3,
  healthConsent: 4,
  form: 4,
};

function Result({ state }: { state: Extract<ScreeningState, { status: "done" }> }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} tabIndex={-1} className="scroll-mt-24 outline-none">
      <ResultBody state={state} />
    </div>
  );
}

function ResultBody({ state }: { state: Extract<ScreeningState, { status: "done" }> }) {
  if (state.result === "no_elegible") {
    return (
      <Tile className="paso-entra mt-8 sm:p-9" as="section">
        <h2 className="text-2xl" tabIndex={-1}>
          Por ahora el programa no es para ti
        </h2>
        <ul className="mt-4 grid gap-3 text-tinta-2">
          {state.reasons.map((r) => (
            <li key={r}>{NOT_ELIGIBLE_COPY[r]?.(state.bmi) ?? "No cumples uno de los criterios del programa."}</li>
          ))}
        </ul>
        <p className="mt-5 text-tinta-2">
          Si te preocupa tu peso o tu alimentación, tu médico de confianza puede orientarte. Gracias por tu interés.
        </p>
      </Tile>
    );
  }
  const review = state.result === "revisar";
  return (
    <Tile tone={review ? "mist" : "jade"} className="paso-entra mt-8 grid justify-items-start gap-4 sm:p-9" as="section">
      <span className={`flex h-12 w-12 items-center justify-center rounded-full text-blanco ${review ? "bg-tinta" : "bg-jade"}`}>
        <Icon name={review ? "stethoscope" : "check"} className="h-6 w-6" strokeWidth={2.4} />
      </span>
      <h2 className="text-2xl">
        {review ? "Gracias. El médico revisará tus respuestas" : "Gracias. El siguiente paso es tu valoración"}
      </h2>
      {review ? (
        <p className="text-tinta-2">
          Algunas respuestas necesitan que el médico las vea antes de agendar. Te escribiremos por WhatsApp en un máximo de dos
          días hábiles.
        </p>
      ) : (
        <>
          <p className="text-tinta-2">
            Es una videollamada de 20 a 30 minutos con un médico con cédula profesional. Ahí deciden juntos si el tratamiento te
            conviene.
          </p>
          {site.calUrl ? (
            <a
              href={site.calUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex h-14 items-center justify-center rounded-full bg-tinta px-7 font-semibold text-blanco hover:bg-tinta-2"
            >
              Agendar mi valoración
            </a>
          ) : (
            <p className="font-semibold">Te escribiremos por WhatsApp para agendarla.</p>
          )}
        </>
      )}
    </Tile>
  );
}

/** IMC aproximado mientras la persona escribe estatura y peso. */
function BmiPreview() {
  const [value, setValue] = useState<number | null>(null);
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const f = ref.current?.closest("form");
    if (!f) return;
    const update = () => {
      const h = Number((f.elements.namedItem("height_cm") as HTMLInputElement | null)?.value.replace(",", "."));
      const w = Number((f.elements.namedItem("weight_kg") as HTMLInputElement | null)?.value.replace(",", "."));
      setValue(h >= 120 && h <= 220 && w >= 35 && w <= 300 ? bmi(w, h) : null);
    };
    f.addEventListener("input", update);
    return () => f.removeEventListener("input", update);
  }, []);
  return (
    <p ref={ref} className="text-sm text-piedra" aria-live="polite">
      {value ? (
        <>
          Tu IMC aproximado es <strong className="text-tinta">{value}</strong>. El médico lo confirma en la valoración.
        </>
      ) : (
        "Con tu estatura y peso calculamos tu IMC aproximado."
      )}
    </p>
  );
}

export function ScreeningForm({ token, defaultGlp1 }: { token: string; defaultGlp1: string }) {
  const [state, action, pending] = useActionState<ScreeningState, FormData>(submitScreening.bind(null, token), {
    status: "idle",
  });
  const errors = state.status === "error" ? state.errors : {};
  const jumpTo = useMemo(() => {
    if (state.status !== "error") return null;
    const first = Object.keys(state.errors)[0];
    return { step: FIELD_STEP[first] ?? 0 };
  }, [state]);

  if (state.status === "done") return <Result state={state} />;

  const steps: FormStep[] = [
    {
      title: "Datos básicos",
      hint: "Con esto sabemos si los tratamientos que acompañamos están indicados para ti.",
      validate: (f) =>
        check.number(f, "age", 12, 100, "Escribe tu edad en años.") ??
        check.number(f, "height_cm", 120, 220, "Escribe tu estatura en centímetros, por ejemplo 162.") ??
        check.number(f, "weight_kg", 35, 300, "Escribe tu peso en kilos, por ejemplo 85.5.") ??
        check.optionalNumber(f, "waist_cm", 50, 250, "Revisa tu cintura en centímetros."),
      body: (
        <>
          <Field id="age" label="Edad" error={errors.age}>
            <Input id="age" name="age" inputMode="numeric" className="max-w-[10rem]" {...describe("age", errors.age)} />
          </Field>
          <Segmented
            name="sex"
            legend="Sexo"
            defaultValue=""
            options={[
              { value: "mujer", label: "Mujer" },
              { value: "hombre", label: "Hombre" },
              { value: "otro", label: "Otro" },
              { value: "", label: "Prefiero no decir" },
            ]}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="height_cm" label="Estatura en centímetros" error={errors.heightCm}>
              <Input
                id="height_cm"
                name="height_cm"
                inputMode="decimal"
                placeholder="162"
                {...describe("height_cm", errors.heightCm)}
              />
            </Field>
            <Field id="weight_kg" label="Peso en kilos" error={errors.weightKg}>
              <Input
                id="weight_kg"
                name="weight_kg"
                inputMode="decimal"
                placeholder="85.5"
                {...describe("weight_kg", errors.weightKg)}
              />
            </Field>
          </div>
          <BmiPreview />
          <Field
            id="waist_cm"
            label="Cintura en centímetros"
            optional
            error={errors.waistCm}
            hint="Mídela a la altura del ombligo, sin apretar."
          >
            <Input
              id="waist_cm"
              name="waist_cm"
              inputMode="decimal"
              className="max-w-[10rem]"
              {...describe("waist_cm", errors.waistCm, true)}
            />
          </Field>
        </>
      ),
    },
    {
      title: "¿Te han diagnosticado alguna de estas?",
      hint: "Marca todas las que apliquen. Si ninguna aplica, continúa.",
      body: (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {Object.entries(COMORBIDITIES).map(([key, label]) => (
            <ChoiceCard key={key} type="checkbox" name="comorbidities" value={key} label={label} />
          ))}
        </div>
      ),
    },
    {
      title: "Preguntas de seguridad",
      hint: "Algunas condiciones hacen riesgoso un tratamiento. Marca las que apliquen.",
      validate: (f) =>
        f.querySelector('input[name="risk"]:checked') || f.querySelector<HTMLInputElement>('input[name="risk_none"]')?.checked
          ? null
          : { field: "risk_none", message: "Marca las que apliquen o «Ninguna aplica para mí»." },
      body: (
        <div
          className="grid gap-2.5"
          onChange={(e) => {
            const t = e.target as HTMLInputElement;
            const f = t.form;
            if (!f || !t.checked) return;
            if (t.name === "risk") {
              const none = f.querySelector<HTMLInputElement>('input[name="risk_none"]');
              if (none) none.checked = false;
            }
            if (t.name === "risk_none")
              f.querySelectorAll<HTMLInputElement>('input[name="risk"]').forEach((x) => (x.checked = false));
          }}
        >
          {Object.entries(RISK_QUESTIONS).map(([key, label]) => (
            <ChoiceCard key={key} type="checkbox" name="risk" value={key} label={label} />
          ))}
          <ChoiceCard
            type="checkbox"
            name="risk_none"
            label={<strong className="font-semibold">Ninguna aplica para mí</strong>}
          />
          {errors.riskAnswers && <FieldError>{errors.riskAnswers}</FieldError>}
        </div>
      ),
    },
    {
      title: "Tus medicamentos",
      validate: (f) => check.checked(f, "glp1", "Elige una opción."),
      body: (
        <>
          <fieldset className="grid gap-3">
            <legend className="mb-3 font-semibold">¿Usas un medicamento para bajar de peso?</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {GLP1_OPTIONS.map(([value, label]) => (
                <ChoiceCard
                  key={value}
                  type="radio"
                  name="glp1"
                  value={value}
                  defaultChecked={defaultGlp1 === value}
                  label={label}
                />
              ))}
            </div>
            {errors.glp1 && <FieldError>{errors.glp1}</FieldError>}
          </fieldset>
          <Field
            id="medications"
            label="¿Qué otros medicamentos tomas?"
            optional
            error={errors.medications}
            hint="Nombre y dosis si la sabes. Incluye el de peso si ya lo usas."
          >
            <Textarea id="medications" name="medications" rows={3} {...describe("medications", errors.medications, true)} />
          </Field>
        </>
      ),
    },
    {
      title: "Tu consentimiento",
      hint: "Tus respuestas son datos de salud. Las usamos solo para tu valoración y tu seguimiento.",
      validate: (f) => check.checked(f, "health_consent", "Sin tu consentimiento no podemos guardar tus respuestas."),
      body: (
        <>
          <ul className="grid gap-3 rounded-2xl bg-niebla p-5 text-sm text-tinta-2">
            <li className="flex gap-2.5">
              <Icon name="lock" className="mt-0.5 h-4 w-4 text-jade" />
              Solo las ve el equipo que te atiende y el médico que te valora.
            </li>
            <li className="flex gap-2.5">
              <Icon name="shield" className="mt-0.5 h-4 w-4 text-jade" />
              Nunca las compartimos con anunciantes, farmacias ni laboratorios.
            </li>
            <li className="flex gap-2.5">
              <Icon name="check" className="mt-0.5 h-4 w-4 text-jade" />
              Puedes pedir que las corrijamos o borremos cuando quieras.
            </li>
          </ul>
          <div className="grid gap-2">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                name="health_consent"
                className="mt-1 h-5 w-5 flex-none accent-tinta"
                {...describe("health_consent", errors.healthConsent)}
              />
              <span>
                Doy mi consentimiento expreso para que {site.brand} trate mis datos de salud según el{" "}
                <Link href="/aviso-de-privacidad" target="_blank" className="font-semibold underline underline-offset-2">
                  aviso de privacidad
                </Link>
                , incluido compartirlos con el médico que me valore.
              </span>
            </label>
            {errors.healthConsent && <FieldError id="health_consent-error">{errors.healthConsent}</FieldError>}
          </div>
          {errors.form && (
            <p role="alert" className="rounded-xl bg-alerta-suave p-3 text-sm font-semibold text-alerta">
              {errors.form}
            </p>
          )}
        </>
      ),
    },
  ];

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} noValidate className="mt-10">
      <FormSteps steps={steps} submitLabel="Enviar mis respuestas" pending={pending} pendingLabel="Enviando…" jumpTo={jumpTo} />
    </form>
  );
}
