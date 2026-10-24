"use client";

import Link from "next/link";
import { submitWithoutReset, useFocusFirstError } from "@/components/form-utils";
import { useActionState } from "react";
import { submitScreening, type ScreeningState } from "@/app/actions/screening";
import { site } from "@/lib/config";
import { COMORBIDITIES, RISK_QUESTIONS } from "@/lib/screening";

const GLP1_OPTIONS = [
  ["actualmente", "Sí, ya lo uso"],
  ["por_iniciar", "Lo voy a iniciar"],
  ["no", "No"],
  ["no_se", "No estoy seguro"],
] as const;

const NOT_ELIGIBLE_COPY: Record<string, (bmi: number) => string> = {
  menor_de_edad: () => "El programa es solo para personas de 18 años o más.",
  imc_bajo: (bmi) =>
    `Con la estatura y el peso que nos diste, tu IMC es ${bmi}. Los tratamientos que acompañamos se indican a partir de un IMC de 27 con alguna enfermedad relacionada, o de 30.`,
  imc_sin_comorbilidad: (bmi) =>
    `Tu IMC es ${bmi}. Entre 27 y 29.9 el tratamiento se indica cuando también hay una enfermedad relacionada, como presión alta o prediabetes. Si tienes alguna y no la marcaste, escríbenos.`,
};

function Result({ state }: { state: Extract<ScreeningState, { status: "done" }> }) {
  if (state.result === "no_elegible") {
    return (
      <div role="status" className="mt-8 rounded-2xl border border-linea bg-blanco p-6 sm:p-8">
        <h2 className="text-xl font-bold">Por ahora el programa no es para ti</h2>
        <ul className="mt-4 grid gap-2">
          {state.reasons.map((r) => (
            <li key={r}>{NOT_ELIGIBLE_COPY[r]?.(state.bmi) ?? "No cumples uno de los criterios del programa."}</li>
          ))}
        </ul>
        <p className="mt-4 text-anil-suave">
          Si te preocupa tu peso o tu alimentación, tu médico de confianza puede orientarte. Gracias por tu interés.
        </p>
      </div>
    );
  }
  const review = state.result === "revisar";
  return (
    <div role="status" className="mt-8 rounded-2xl bg-hoja p-6 sm:p-8">
      <h2 className="text-xl font-bold">{review ? "Gracias. El médico revisará tus respuestas" : "Gracias. El siguiente paso es tu valoración"}</h2>
      {review ? (
        <p className="mt-3">
          Algunas respuestas necesitan que el médico las vea antes de agendar. Te escribiremos por WhatsApp en un
          máximo de 2 días hábiles.
        </p>
      ) : (
        <>
          <p className="mt-3">
            Es una videollamada de 20 a 30 minutos con un médico con cédula profesional. Ahí deciden juntos si el
            tratamiento te conviene.
          </p>
          {site.calUrl ? (
            <a href={site.calUrl} target="_blank" rel="noopener" className="btn btn-primary mt-5">
              Agendar mi valoración
            </a>
          ) : (
            <p className="mt-3 font-bold">Te escribiremos por WhatsApp para agendarla.</p>
          )}
        </>
      )}
    </div>
  );
}

export function ScreeningForm({ token, defaultGlp1 }: { token: string; defaultGlp1: string }) {
  const [state, action, pending] = useActionState<ScreeningState, FormData>(submitScreening.bind(null, token), {
    status: "idle",
  });
  const formRef = useFocusFirstError(state);
  if (state.status === "done") return <Result state={state} />;

  const errors = state.status === "error" ? state.errors : {};
  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="error">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  return (
    <form ref={formRef} action={action} onSubmit={submitWithoutReset(action)} noValidate className="mt-8 grid gap-10">
      <fieldset className="grid gap-5">
        <legend className="mb-1 text-lg font-bold">Datos básicos</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="age" className="label">
              Edad
            </label>
            <input id="age" name="age" inputMode="numeric" className="input" {...aria("age")} />
            {err("age")}
          </div>
          <div className="field">
            <label htmlFor="sex" className="label">
              Sexo
            </label>
            <select id="sex" name="sex" className="input" defaultValue="">
              <option value="">Prefiero no decir</option>
              <option value="mujer">Mujer</option>
              <option value="hombre">Hombre</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="height_cm" className="label">
              Estatura en centímetros
            </label>
            <input id="height_cm" name="height_cm" inputMode="decimal" placeholder="162" className="input" {...aria("heightCm")} />
            {err("heightCm")}
          </div>
          <div className="field">
            <label htmlFor="weight_kg" className="label">
              Peso en kilos
            </label>
            <input id="weight_kg" name="weight_kg" inputMode="decimal" placeholder="85.5" className="input" {...aria("weightKg")} />
            {err("weightKg")}
          </div>
          <div className="field sm:col-span-2">
            <label htmlFor="waist_cm" className="label">
              Cintura en centímetros <span className="font-normal text-piedra">(opcional)</span>
            </label>
            <input id="waist_cm" name="waist_cm" inputMode="decimal" className="input sm:max-w-[50%]" {...aria("waistCm")} />
            <p className="hint">Mídela a la altura del ombligo, sin apretar.</p>
            {err("waistCm")}
          </div>
        </div>
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-1 text-lg font-bold">¿Te han diagnosticado alguna de estas?</legend>
        <p className="hint -mt-1">Marca todas las que apliquen. Si ninguna, déjalas sin marcar.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(COMORBIDITIES).map(([key, label]) => (
            <label key={key} className="choice">
              <input type="checkbox" name="comorbidities" value={key} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-3" {...(errors.riskAnswers ? { "aria-describedby": "riskAnswers-error" } : {})}>
        <legend className="mb-1 text-lg font-bold">Preguntas de seguridad</legend>
        <p className="hint -mt-1">Algunas condiciones hacen riesgoso un tratamiento. Marca las que apliquen.</p>
        <div className="grid gap-2">
          {Object.entries(RISK_QUESTIONS).map(([key, label]) => (
            <label key={key} className="choice">
              <input type="checkbox" name="risk" value={key} />
              <span>{label}</span>
            </label>
          ))}
          <label className="choice">
            <input type="checkbox" name="risk_none" />
            <span className="font-bold">Ninguna aplica para mí</span>
          </label>
        </div>
        {err("riskAnswers")}
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-1 text-lg font-bold">Medicamentos</legend>
        <div className="grid gap-2" role="radiogroup" aria-labelledby="glp1-label">
          <p id="glp1-label" className="label">
            ¿Usas un medicamento para bajar de peso?
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {GLP1_OPTIONS.map(([value, label]) => (
              <label key={value} className="choice">
                <input type="radio" name="glp1" value={value} defaultChecked={defaultGlp1 === value} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {err("glp1")}
        </div>
        <div className="field">
          <label htmlFor="medications" className="label">
            ¿Qué otros medicamentos tomas? <span className="font-normal text-piedra">(opcional)</span>
          </label>
          <textarea id="medications" name="medications" rows={3} className="input" {...aria("medications")} />
          <p className="hint">Nombre y dosis si la sabes. Incluye el de peso si ya lo usas.</p>
          {err("medications")}
        </div>
      </fieldset>

      <div className="grid gap-3 rounded-2xl border border-linea bg-blanco p-5">
        <label className="flex gap-3">
          <input type="checkbox" name="health_consent" className="mt-1 h-5 w-5 flex-none accent-jade" {...aria("healthConsent")} />
          <span>
            Doy mi consentimiento expreso para que {site.brand} trate mis datos de salud con las finalidades descritas en
            el{" "}
            <Link href="/aviso-de-privacidad" target="_blank" className="underline">
              aviso de privacidad
            </Link>
            , incluido compartirlos con el médico que me valore.
          </span>
        </label>
        {err("healthConsent")}
      </div>

      {(errors.form || Object.keys(errors).length > 0) && (
        <p role="alert" className="error">
          {errors.form ?? "Revisa los campos marcados."}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Enviando…" : "Enviar mis respuestas"}
        </button>
      </div>
    </form>
  );
}
