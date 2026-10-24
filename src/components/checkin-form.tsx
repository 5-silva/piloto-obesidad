"use client";

import { useActionState, useState } from "react";
import { saveCheckin, type CheckinState } from "@/app/actions/checkin";
import { submitWithoutReset, useFocusFirstError } from "@/components/form-utils";
import { MOOD_SCALE, SYMPTOM_SCALE, WARNING_SIGNS } from "@/lib/checkin";
import { CRISIS_LINE } from "@/lib/config";
import type { Checkin } from "@/lib/data/types";

const GUIDANCE = {
  urgente: {
    tone: "bg-alerta-fondo text-alerta",
    title: "Marcaste una señal de alarma",
    body: "Si los síntomas son fuertes ahora, llama al 911 o ve a urgencias. El equipo ya recibió el aviso y te contactará hoy.",
  },
  animo: {
    tone: "bg-aviso-fondo text-aviso",
    title: "Gracias por contarnos cómo te sientes",
    body: `Alguien del equipo te escribirá hoy. Si estás pasando por un momento muy difícil o piensas en hacerte daño, llama a la ${CRISIS_LINE.name} al ${CRISIS_LINE.phone}, las 24 horas.`,
  },
  sintomas: {
    tone: "bg-aviso-fondo text-aviso",
    title: "La náusea fuerte hay que atenderla",
    body: "Come porciones pequeñas, toma líquidos a sorbos y evita lo muy grasoso. Te escribiremos hoy para revisarlo con el médico antes de tu siguiente dosis.",
  },
  normal: { tone: "bg-hoja text-jade-oscuro", title: "Listo, guardamos tu semana", body: "Nos vemos en tu próximo check-in." },
} as const;

function Scale({ name, label, options, initial, offset = 0 }: { name: string; label: string; options: readonly string[]; initial: number | null; offset?: number }) {
  return (
    <fieldset>
      <legend className="label mb-2">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {options.map((o, i) => (
          <label key={o} className="choice py-2">
            <input type="radio" name={name} value={i + offset} defaultChecked={initial === i + offset} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CheckinForm({ week, initial, onDone }: { week: number; initial?: Checkin; onDone?: () => void }) {
  const [state, action, pending] = useActionState<CheckinState, FormData>(saveCheckin, { status: "idle" });
  const [warning, setWarning] = useState((initial?.warningSigns.length ?? 0) > 0);
  const formRef = useFocusFirstError(state);

  if (state.status === "ok") {
    const g = GUIDANCE[state.guidance];
    return (
      <div role="status" className={`rounded-xl p-5 ${g.tone}`}>
        <p className="text-lg font-bold">{g.title}</p>
        <p className="mt-2 text-anil">{g.body}</p>
        {onDone && (
          <button type="button" onClick={onDone} className="btn btn-secondary btn-sm mt-4">
            Cerrar
          </button>
        )}
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  return (
    <form ref={formRef} action={action} onSubmit={submitWithoutReset(action)} noValidate className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="weight_kg" className="label">
            Peso de hoy en kilos
          </label>
          <input
            id="weight_kg"
            name="weight_kg"
            inputMode="decimal"
            defaultValue={initial?.weightKg ?? ""}
            className="input text-lg"
            aria-invalid={!!errors.weightKg}
            aria-describedby={errors.weightKg ? "weight-error" : "weight-hint"}
          />
          {errors.weightKg ? (
            <p id="weight-error" className="error">
              {errors.weightKg}
            </p>
          ) : (
            <p id="weight-hint" className="hint">
              Mejor en ayunas y en la misma báscula.
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="waist_cm" className="label">
            Cintura en cm <span className="font-normal text-piedra">(opcional)</span>
          </label>
          <input id="waist_cm" name="waist_cm" inputMode="decimal" defaultValue={initial?.waistCm ?? ""} className="input" aria-invalid={!!errors.waistCm} />
          {errors.waistCm && <p className="error">{errors.waistCm}</p>}
        </div>
      </div>

      <fieldset>
        <legend className="label mb-2">¿Aplicaste o tomaste tu medicamento esta semana?</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ["si", "Sí"],
              ["no", "No"],
              ["no_aplica", "No uso medicamento"],
            ] as const
          ).map(([v, l]) => (
            <label key={v} className="choice py-2">
              <input type="radio" name="took_dose" value={v} defaultChecked={initial?.tookDose === v} />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Scale name="nausea" label="Náusea" options={SYMPTOM_SCALE} initial={initial?.nausea ?? null} />
      <Scale name="constipation" label="Estreñimiento" options={SYMPTOM_SCALE} initial={initial?.constipation ?? null} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="water_liters" className="label">
            Agua al día, en litros
          </label>
          <input id="water_liters" name="water_liters" inputMode="decimal" defaultValue={initial?.waterLiters ?? ""} className="input" aria-invalid={!!errors.waterLiters} />
          {errors.waterLiters && <p className="error">{errors.waterLiters}</p>}
        </div>
        <div className="field">
          <label htmlFor="strength_sessions" className="label">
            Sesiones de fuerza esta semana
          </label>
          <input id="strength_sessions" name="strength_sessions" inputMode="numeric" defaultValue={initial?.strengthSessions ?? ""} className="input" aria-invalid={!!errors.strengthSessions} />
          {errors.strengthSessions && <p className="error">{errors.strengthSessions}</p>}
        </div>
      </div>

      <Scale name="mood" label="¿Cómo te has sentido de ánimo?" options={MOOD_SCALE} initial={initial?.mood ?? null} offset={1} />

      <fieldset className="rounded-xl border border-linea p-4">
        <legend className="label px-1">¿Tuviste alguno de estos?</legend>
        <div className="mt-1 grid gap-2">
          {Object.entries(WARNING_SIGNS).map(([k, l]) => (
            <label key={k} className="choice">
              <input
                type="checkbox"
                name="warning"
                value={k}
                defaultChecked={initial?.warningSigns.includes(k)}
                onChange={(e) => {
                  const form = e.currentTarget.form;
                  setWarning(!!form && form.querySelectorAll('input[name="warning"]:checked').length > 0);
                }}
              />
              <span>{l}</span>
            </label>
          ))}
        </div>
        {warning && (
          <p role="alert" className="mt-3 rounded-lg bg-alerta-fondo p-3 font-bold text-alerta">
            Si lo tienes ahora y es fuerte, no esperes: llama al 911 o ve a urgencias.
          </p>
        )}
      </fieldset>

      <div className="field">
        <label htmlFor="note" className="label">
          ¿Algo más que quieras contarnos? <span className="font-normal text-piedra">(opcional)</span>
        </label>
        <textarea id="note" name="note" rows={3} defaultValue={initial?.note ?? ""} className="input" />
      </div>

      {errors.form && (
        <p role="alert" className="error">
          {errors.form}
        </p>
      )}
      <button className="btn btn-primary justify-self-start" disabled={pending}>
        {pending ? "Guardando…" : `Guardar semana ${week}`}
      </button>
    </form>
  );
}
