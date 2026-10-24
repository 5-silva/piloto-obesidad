import Link from "next/link";
import type { LeadStatus, PatientStatus } from "@/lib/data/types";
import { LEAD_STATUS_LABELS, PATIENT_STATUS_LABELS } from "@/lib/data/types";

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}

export function Card({ title, children, className = "", action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={`rounded-xl border border-linea bg-blanco p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

type Tone = "neutral" | "good" | "warn" | "bad" | "strong";

const TONES: Record<Tone, string> = {
  neutral: "bg-papel text-anil-suave ring-1 ring-linea",
  good: "bg-hoja text-jade-oscuro",
  warn: "bg-aviso-fondo text-aviso",
  bad: "bg-alerta-fondo text-alerta",
  strong: "bg-jade text-blanco",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-bold ${TONES[tone]}`}>
      {children}
    </span>
  );
}

const LEAD_TONE: Record<LeadStatus, Tone> = {
  nuevo: "neutral",
  contactado: "neutral",
  tamizaje_enviado: "neutral",
  elegible: "good",
  revisar: "warn",
  no_elegible: "neutral",
  agendado: "good",
  activo: "strong",
  descartado: "neutral",
};

export function LeadStatusPill({ status }: { status: LeadStatus }) {
  return <Pill tone={LEAD_TONE[status]}>{LEAD_STATUS_LABELS[status]}</Pill>;
}

const PATIENT_TONE: Record<PatientStatus, Tone> = { activo: "good", pausa: "warn", baja: "neutral", completado: "strong" };

export function PatientStatusPill({ status }: { status: PatientStatus }) {
  return <Pill tone={PATIENT_TONE[status]}>{PATIENT_STATUS_LABELS[status]}</Pill>;
}

export function WaButton({ href, children = "WhatsApp" }: { href: string; children?: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="btn btn-secondary btn-sm">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-jade">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"
        />
      </svg>
      {children}
    </a>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg bg-papel p-4 text-piedra">{children}</p>;
}

export function pct(rate: number | null): string {
  return rate === null ? "—" : `${Math.round(rate * 100)}%`;
}

export function mxn(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-bold text-anil underline decoration-linea underline-offset-4 hover:decoration-anil">
      {children}
    </Link>
  );
}
