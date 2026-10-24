"use client";

import { useActionState, useMemo, useState } from "react";
import { saveCheckin, type CheckinState } from "@/app/actions/checkin";
import type { CheckinGuidance } from "@/lib/checkin";
import { submitWithoutReset, useReveal } from "@/components/form-utils";
import { Button } from "@/components/ui/button";
import { ChoiceCard, NumberStepper, Segmented } from "@/components/ui/choice";
import { describe, Field, Input, Textarea } from "@/components/ui/field";
import { check, FormSteps, type FormStep } from "@/components/ui/form-steps";
import { Notice } from "@/components/ui/surface";
import { MOOD_SCALE, SYMPTOM_SCALE, WARNING_SIGNS } from "@/lib/checkin";
import { CRISIS_LINE } from "@/lib/config";
import type { Checkin } from "@/lib/data/types";

const GUIDANCE = {
  urgente: {
    tone: "alerta",
    title: "Marcaste una señal de alarma",
    body: "Si los síntomas son fuertes ahora, llama al 911 o ve a urgencias. El equipo ya recibió el aviso y te contactará hoy.",
  },
  animo: {
    tone: "aviso",
    title: "Gracias por contarnos cómo te sientes",
    body: `Alguien del equipo te escribirá hoy. Si estás pasando por un momento muy difícil o piensas en hacerte daño, llama a la ${CRISIS_LINE.name} al ${CRISIS_LINE.phone}, las 24 horas.`,
  },
  sintomas: {
    tone: "aviso",
    title: "La náusea fuerte hay que atenderla",
    body: "Come porciones pequeñas, toma líquidos a sorbos y evita lo muy grasoso. Te escribiremos hoy para revisarlo con el médico antes de tu siguiente dosis.",
  },
  normal: {
    tone: "jade",
    title: "Listo, guardamos tu lunes",
    body: "Nos vemos el próximo lunes. Si algo cambia antes, escríbenos por WhatsApp.",
  },
} as const;

// Qué paso contiene cada campo, para regresar ahí si el servidor marca un error.
const FIELD_STEP: Record<string, number> = { weightKg: 0, waistCm: 0, waterLiters: 2, strengthSessions: 2, form: 4 };

const symptomOptions = SYMPTOM_SCALE.map((label, i) => ({ value: String(i), label }));
const moodOptions = MOOD_SCALE.map((label, i) => ({ value: String(i + 1), label }));

export function CheckinForm({
  week,
  initial,
  lastWeight,
  onClose,
}: {
  week: number;
  initial?: Checkin;
  lastWeight?: number | null;
  onClose?: () => void;
}) {
  const [state, action, pending] = useActionState<CheckinState, FormData>(saveCheckin, { status: "idle" });
  const [warning, setWarning] = useState((initial?.warningSigns.length ?? 0) > 0);
  const [showWaist, setShowWaist] = useState(initial?.waistCm != null);
  const errors = state.status === "error" ? state.errors : {};

  const jumpTo = useMemo(() => {
    if (state.status !== "error") return null;
    const first = Object.keys(state.errors)[0];
    return { step: FIELD_STEP[first] ?? 0 };
  }, [state]);

  if (state.status === "ok") return <CheckinDone guidance={state.guidance} onClose={onClose} />;

  const steps: FormStep[] = [
    {
      title: "¿Cuánto pesas hoy?",
      hint: "Mejor en ayunas, con poca ropa y en la misma báscula de siempre.",
      validate: (f) =>
        check.number(f, "weight_kg", 35, 300, "Escribe tu peso en kilos, por ejemplo 82.5.") ??
        check.optionalNumber(f, "waist_cm", 50, 250, "Revisa tu cintura en centímetros."),
      body: (
        <>
          <div className="grid gap-2">
            <label htmlFor="weight_kg" className="sr-only">
              Peso en kilos
            </label>
            <div className="flex items-baseline gap-3">
              <Input
                id="weight_kg"
                name="weight_kg"
                inputMode="decimal"
                autoComplete="off"
                placeholder={lastWeight ? String(lastWeight) : "0.0"}
                defaultValue={initial?.weightKg ?? ""}
                className="h-20 max-w-[12rem] text-center text-[2.5rem]! font-medium tracking-[-0.03em] tabular-nums"
                {...describe("weight_kg", errors.weightKg, true)}
              />
              <span className="text-xl text-piedra">kg</span>
            </div>
            {errors.weightKg ? (
              <p id="weight_kg-error" className="text-sm font-semibold text-alerta">
                {errors.weightKg}
              </p>
            ) : (
              <p id="weight_kg-hint" className="text-sm text-piedra">
                {lastWeight ? `Tu registro anterior: ${lastWeight.toFixed(1)} kg.` : "Es tu primer registro."}
              </p>
            )}
          </div>
          {showWaist ? (
            <Field
              id="waist_cm"
              label="Cintura en centímetros"
              optional
              error={errors.waistCm}
              hint="A la altura del ombligo, sin apretar."
            >
              <Input
                id="waist_cm"
                name="waist_cm"
                inputMode="decimal"
                defaultValue={initial?.waistCm ?? ""}
                className="max-w-[12rem]"
                {...describe("waist_cm", errors.waistCm, true)}
              />
            </Field>
          ) : (
            <button
              type="button"
              onClick={() => setShowWaist(true)}
              className="justify-self-start text-sm font-semibold underline decoration-linea-2 underline-offset-4"
            >
              Agregar mi cintura (opcional)
            </button>
          )}
        </>
      ),
    },
    {
      title: "Tu medicamento y síntomas",
      hint: "Es normal sentir algo al empezar o al subir la dosis. Cuéntanos sin filtro.",
      body: (
        <>
          <Segmented
            name="took_dose"
            legend="¿Aplicaste o tomaste tu medicamento esta semana?"
            defaultValue={initial?.tookDose}
            options={[
              { value: "si", label: "Sí" },
              { value: "no", label: "No" },
              { value: "no_aplica", label: "No uso" },
            ]}
          />
          <Segmented name="nausea" legend="Náusea" defaultValue={initial?.nausea?.toString()} options={symptomOptions} />
          <Segmented
            name="constipation"
            legend="Estreñimiento"
            defaultValue={initial?.constipation?.toString()}
            options={symptomOptions}
          />
        </>
      ),
    },
    {
      title: "Tus hábitos de la semana",
      hint: "Una aproximación basta. Toca + o − para ajustar.",
      body: (
        <>
          <NumberStepper
            name="water_liters"
            label="Agua al día"
            unit="L"
            min={0}
            max={6}
            step={0.5}
            defaultValue={initial?.waterLiters ?? null}
          />
          <NumberStepper
            name="strength_sessions"
            label="Sesiones de fuerza en la semana"
            min={0}
            max={14}
            defaultValue={initial?.strengthSessions ?? null}
          />
        </>
      ),
    },
    {
      title: "¿Cómo te has sentido?",
      body: (
        <>
          <Segmented name="mood" legend="Tu ánimo esta semana" defaultValue={initial?.mood?.toString()} options={moodOptions} />
          <Field id="note" label="¿Algo que quieras contarnos?" optional>
            <Textarea
              id="note"
              name="note"
              rows={3}
              defaultValue={initial?.note ?? ""}
              placeholder="Por ejemplo, un antojo difícil, un logro o una duda para el médico."
            />
          </Field>
        </>
      ),
    },
    {
      title: "Una última pregunta de seguridad",
      hint: "¿Tuviste alguno de estos síntomas esta semana?",
      validate: (f) =>
        f.querySelector('input[name="warning"]:checked') ||
        f.querySelector<HTMLInputElement>('input[name="warning_none"]')?.checked
          ? null
          : { field: "warning_none", message: "Marca los que tuviste o «Ninguno»." },
      body: (
        <div
          className="grid gap-2.5"
          onChange={(e) => {
            const f = (e.target as HTMLInputElement).form;
            if (!f) return;
            const t = e.target as HTMLInputElement;
            const none = f.querySelector<HTMLInputElement>('input[name="warning_none"]');
            if (t.name === "warning" && t.checked && none) none.checked = false;
            if (t.name === "warning_none" && t.checked)
              f.querySelectorAll<HTMLInputElement>('input[name="warning"]').forEach((x) => (x.checked = false));
            setWarning(f.querySelectorAll('input[name="warning"]:checked').length > 0);
          }}
        >
          {Object.entries(WARNING_SIGNS).map(([k, l]) => (
            <ChoiceCard
              key={k}
              type="checkbox"
              name="warning"
              value={k}
              defaultChecked={initial?.warningSigns.includes(k)}
              label={l}
            />
          ))}
          <ChoiceCard
            type="checkbox"
            name="warning_none"
            defaultChecked={!!initial && initial.warningSigns.length === 0}
            label={<strong className="font-semibold">Ninguno</strong>}
          />
          {warning && (
            <Notice tone="alerta" title="Si lo tienes ahora y es fuerte, no esperes" live="assertive" className="mt-2">
              Llama al 911 o ve a urgencias. Al guardar, el equipo recibe un aviso.
            </Notice>
          )}
          {errors.form && (
            <p role="alert" className="text-sm font-semibold text-alerta">
              {errors.form}
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} noValidate>
      <FormSteps steps={steps} submitLabel={`Guardar mi lunes ${week}`} pending={pending} jumpTo={jumpTo} />
    </form>
  );
}

function CheckinDone({ guidance, onClose }: { guidance: CheckinGuidance; onClose?: () => void }) {
  const ref = useReveal<HTMLDivElement>();
  const g = GUIDANCE[guidance];
  return (
    <div ref={ref} tabIndex={-1} className="paso-entra grid gap-5 outline-none">
      <Notice tone={g.tone} title={g.title} live={guidance === "urgente" ? "assertive" : "polite"}>
        {g.body}
      </Notice>
      {onClose && (
        <Button variant="secondary" onClick={onClose} className="justify-self-start">
          Cerrar
        </Button>
      )}
    </div>
  );
}
