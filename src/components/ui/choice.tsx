"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Icon } from "./icon";

/** Radio o casilla dentro de una tarjeta tocable. */
export function ChoiceCard({
  label,
  description,
  className = "",
  ...input
}: ComponentProps<"input"> & { label: ReactNode; description?: ReactNode }) {
  return (
    <label className={`choice ${className}`}>
      <input {...input} />
      <span className="grid gap-0.5">
        <span className="leading-snug">{label}</span>
        {description && <span className="text-sm text-piedra">{description}</span>}
      </span>
    </label>
  );
}

/** Grupo de opciones cortas en una fila (escalas, sí/no). */
export function Segmented({
  name,
  legend,
  options,
  defaultValue,
  hint,
  error,
}: {
  name: string;
  legend: ReactNode;
  options: readonly { value: string; label: string }[];
  defaultValue?: string | null;
  hint?: ReactNode;
  error?: string;
}) {
  return (
    <fieldset className="grid gap-3" aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-3 font-semibold">{legend}</legend>
      <div className="segmented">
        {options.map((o) => (
          <label key={o.value}>
            <input type="radio" name={name} value={o.value} defaultChecked={defaultValue === o.value} />
            {o.label}
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${name}-error`} className="text-sm font-semibold text-alerta">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-piedra">{hint}</p>
      )}
    </fieldset>
  );
}

/** Contador con botones − y +. Envía el valor en un input oculto. */
export function NumberStepper({
  name,
  label,
  unit,
  min = 0,
  max = 99,
  step = 1,
  defaultValue = null,
}: {
  name: string;
  label: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | null;
}) {
  const [value, setValue] = useState<number | null>(defaultValue);
  const set = (v: number) => setValue(Math.min(max, Math.max(min, Math.round(v * 10) / 10)));
  const id = `${name}-value`;
  return (
    <div className="grid gap-3">
      <span id={`${name}-label`} className="font-semibold">
        {label}
      </span>
      <div
        className="flex items-center justify-between gap-3 rounded-full bg-niebla p-1.5"
        role="group"
        aria-labelledby={`${name}-label`}
      >
        <button
          type="button"
          onClick={() => set((value ?? min) - step)}
          disabled={value === null || value <= min}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-blanco text-tinta shadow-[inset_0_0_0_1.5px_var(--color-linea-2)] transition-transform active:scale-95 disabled:opacity-40"
          aria-label={`Menos ${unit ?? ""}`.trim()}
        >
          <Icon name="minus" />
        </button>
        <output id={id} aria-live="polite" className="min-w-[6rem] text-center text-xl font-semibold tabular-nums">
          {value === null ? (
            <span className="text-base font-normal text-piedra">Sin registrar</span>
          ) : (
            `${value}${unit ? ` ${unit}` : ""}`
          )}
        </output>
        <button
          type="button"
          onClick={() => set(value === null ? (defaultValue ?? min + step) : value + step)}
          disabled={value !== null && value >= max}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-blanco text-tinta shadow-[inset_0_0_0_1.5px_var(--color-linea-2)] transition-transform active:scale-95 disabled:opacity-40"
          aria-label={`Más ${unit ?? ""}`.trim()}
        >
          <Icon name="plus" />
        </button>
      </div>
      <input type="hidden" name={name} value={value ?? ""} />
    </div>
  );
}
