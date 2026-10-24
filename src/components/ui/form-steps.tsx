"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "./button";
import { FieldError } from "./field";
import { Icon } from "./icon";

export type StepIssue = { field?: string; message: string };

export type FormStep = {
  title: string;
  hint?: ReactNode;
  body: ReactNode;
  /** Validación en el navegador antes de avanzar. El servidor vuelve a validar todo. */
  validate?: (form: HTMLFormElement) => StepIssue | null;
};

/**
 * Formulario por pasos: una decisión por pantalla, con progreso visible.
 * Todos los pasos viven en el mismo <form>, así que el envío no cambia.
 */
export function FormSteps({
  steps,
  submitLabel,
  pending,
  pendingLabel = "Guardando…",
  jumpTo,
  footer,
}: {
  steps: FormStep[];
  submitLabel: string;
  pending: boolean;
  pendingLabel?: string;
  /** Paso al que saltar cuando el servidor devuelve un error. */
  jumpTo?: { step: number } | null;
  footer?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [issue, setIssue] = useState<StepIssue | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const last = index === steps.length - 1;

  useEffect(() => {
    if (!jumpTo) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(Math.min(jumpTo.step, steps.length - 1));
    moved.current = true;
  }, [jumpTo, steps.length]);

  useEffect(() => {
    if (!moved.current) return;
    titleRef.current?.focus({ preventScroll: true });
    rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [index]);

  function form() {
    return rootRef.current?.closest("form") ?? null;
  }

  /** Valida el paso actual; si falla, muestra el motivo y enfoca el campo. */
  function validateCurrent() {
    const f = form();
    const problem = f && steps[index].validate ? steps[index].validate!(f) : null;
    setIssue(problem);
    if (problem?.field) f?.querySelector<HTMLElement>(`[name="${problem.field}"]`)?.focus();
    return !problem;
  }

  function next() {
    if (!validateCurrent()) return;
    moved.current = true;
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setIssue(null);
    moved.current = true;
    setIndex((i) => Math.max(0, i - 1));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const t = e.target as HTMLElement;
    if (e.key !== "Enter" || t.tagName !== "INPUT" || (t as HTMLInputElement).type === "checkbox") return;
    e.preventDefault();
    if (!last) next();
    else if (validateCurrent()) form()?.requestSubmit();
  }

  return (
    <div ref={rootRef} onKeyDown={onKeyDown} className="scroll-mt-24">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-piedra" aria-live="polite">
          Paso {index + 1} de {steps.length}
        </p>
        {index > 0 && (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-1 rounded-full text-sm font-semibold text-tinta-2 hover:text-tinta"
          >
            <Icon name="back" className="h-4 w-4" />
            Atrás
          </button>
        )}
      </div>
      <div
        className="mt-3 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {steps.map((s, i) => (
          <span
            key={s.title}
            className={`h-1.5 rounded-full transition-colors duration-300 ${i <= index ? "bg-tinta" : "bg-niebla-2"}`}
          />
        ))}
      </div>

      {steps.map((s, i) => (
        <div key={s.title} hidden={i !== index} className={i === index ? "paso-entra" : undefined}>
          <h2 ref={i === index ? titleRef : undefined} tabIndex={-1} className="mt-8 text-xl outline-none sm:text-2xl">
            {s.title}
          </h2>
          {s.hint && <p className="mt-2 text-tinta-2">{s.hint}</p>}
          <div className="mt-7 grid gap-7">{s.body}</div>
        </div>
      ))}

      <div className="mt-10 grid gap-3">
        {issue && (
          <div role="alert" className="rounded-xl bg-alerta-suave p-3">
            <FieldError>{issue.message}</FieldError>
          </div>
        )}
        {last ? (
          // Llaves distintas: si React reusara el mismo botón, el clic en «Siguiente»
          // del penúltimo paso lo convertiría en «enviar» y se saltaría el último paso.
          <Button
            key="enviar"
            type="submit"
            size="lg"
            full
            pending={pending}
            pendingLabel={pendingLabel}
            onClick={(e) => {
              if (!validateCurrent()) e.preventDefault();
            }}
          >
            {submitLabel}
          </Button>
        ) : (
          <Button key="siguiente" type="button" size="lg" full onClick={next}>
            Siguiente
          </Button>
        )}
        {footer}
      </div>
    </div>
  );
}

/** Ayudas de validación para los pasos. */
export const check = {
  number(form: HTMLFormElement, name: string, min: number, max: number, message: string): StepIssue | null {
    const raw = (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim().replace(",", ".") ?? "";
    const n = Number(raw);
    return raw === "" || Number.isNaN(n) || n < min || n > max ? { field: name, message } : null;
  },
  optionalNumber(form: HTMLFormElement, name: string, min: number, max: number, message: string): StepIssue | null {
    const raw = (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? "";
    return raw === "" ? null : check.number(form, name, min, max, message);
  },
  checked(form: HTMLFormElement, name: string, message: string): StepIssue | null {
    return form.querySelector(`input[name="${name}"]:checked`) ? null : { field: name, message };
  },
};
