import type { ComponentProps, ReactNode } from "react";

/** Etiqueta, ayuda y error de un campo, con los ids que conectan todo para lectores de pantalla. */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className = "",
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid content-start gap-2 ${className}`}>
      <label htmlFor={id} className="font-semibold">
        {label}
        {optional && <span className="font-normal text-piedra"> (opcional)</span>}
      </label>
      {children}
      {error ? (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-piedra">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-semibold text-alerta">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mt-0.5 h-4 w-4 flex-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d="M12 8v5m0 3v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
      </svg>
      {children}
    </p>
  );
}

/** Atributos ARIA para un control según tenga error o ayuda. */
export function describe(id: string, error?: string, hint?: boolean) {
  if (error) return { "aria-invalid": true as const, "aria-describedby": `${id}-error` };
  if (hint) return { "aria-describedby": `${id}-hint` };
  return {};
}

export function Input({ className = "", ...rest }: ComponentProps<"input">) {
  return <input {...rest} className={`control ${className}`} />;
}

export function Select({ className = "", ...rest }: ComponentProps<"select">) {
  return <select {...rest} className={`control ${className}`} />;
}

export function Textarea({ className = "", ...rest }: ComponentProps<"textarea">) {
  return <textarea {...rest} className={`control min-h-[6.5rem] resize-y ${className}`} />;
}

/** Campo con prefijo fijo, por ejemplo la lada +52. */
export function PrefixInput({ prefix, className = "", ...rest }: ComponentProps<"input"> & { prefix: string }) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-semibold text-piedra"
      >
        {prefix}
      </span>
      <input {...rest} className={`control pl-14 ${className}`} />
    </div>
  );
}
