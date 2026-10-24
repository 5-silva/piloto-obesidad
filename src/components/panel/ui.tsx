import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/surface";
import type { LeadStatus, PatientStatus } from "@/lib/data/types";
import { LEAD_STATUS_LABELS, PATIENT_STATUS_LABELS } from "@/lib/data/types";

export { EmptyState } from "@/components/ui/surface";

export function PageHeader({
  title,
  children,
  back,
}: {
  title: string;
  children?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 grid gap-3">
      {back && (
        <Link href={back.href} className="w-fit text-sm font-semibold text-tinta-2 hover:text-tinta">
          ‹ {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl sm:text-[2.5rem] sm:leading-tight">{title}</h1>
        {children}
      </div>
    </div>
  );
}

/** Tarjeta del panel: superficie blanca sobre el fondo gris del panel. */
export function Card({
  title,
  children,
  className = "",
  action,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`rounded-[var(--radius-bloque)] bg-blanco p-5 ring-1 ring-linea sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-lg">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Contenedor de tabla con desplazamiento horizontal accesible con teclado. */
export function TableScroll({ label, children, minWidth = "44rem" }: { label: string; children: ReactNode; minWidth?: string }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
      <div style={{ minWidth }}>{children}</div>
    </div>
  );
}

export const th = "py-2.5 pr-4 text-left text-xs font-semibold text-piedra";
export const td = "py-3 pr-4 align-top";

const LEAD_TONE: Record<LeadStatus, Parameters<typeof Badge>[0]["tone"]> = {
  nuevo: "rosa",
  contactado: "neutral",
  tamizaje_enviado: "neutral",
  elegible: "jade",
  revisar: "aviso",
  no_elegible: "neutral",
  agendado: "jade",
  activo: "tinta",
  descartado: "neutral",
};

export function LeadStatusPill({ status }: { status: LeadStatus }) {
  return <Badge tone={LEAD_TONE[status]}>{LEAD_STATUS_LABELS[status]}</Badge>;
}

const PATIENT_TONE: Record<PatientStatus, Parameters<typeof Badge>[0]["tone"]> = {
  activo: "jade",
  pausa: "aviso",
  baja: "neutral",
  completado: "tinta",
};

export function PatientStatusPill({ status }: { status: PatientStatus }) {
  return <Badge tone={PATIENT_TONE[status]}>{PATIENT_STATUS_LABELS[status]}</Badge>;
}

/** Abre WhatsApp con el mensaje ya escrito. */
export function WaButton({ href, children = "WhatsApp" }: { href: string; children?: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={buttonClass({ variant: "secondary", size: "sm" })}>
      <WhatsAppIcon className="h-4 w-4 text-jade" />
      {children}
    </a>
  );
}

/** Botón pequeño para acciones de formulario dentro de listas. */
export const smallButton = buttonClass({ variant: "secondary", size: "sm" });

export function pct(rate: number | null): string {
  return rate === null ? "—" : `${Math.round(rate * 100)}%`;
}

export function mxn(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-tinta underline decoration-linea-2 underline-offset-4 hover:decoration-tinta">
      {children}
    </Link>
  );
}

/** Fila de lista del panel: contenido a la izquierda, acciones a la derecha. */
export function ListRow({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <li className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">{children}</div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </li>
  );
}
