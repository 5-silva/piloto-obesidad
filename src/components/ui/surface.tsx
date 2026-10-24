import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";

type TileTone = "plain" | "mist" | "jade" | "ink";

const TILE: Record<TileTone, string> = {
  plain: "bg-blanco ring-1 ring-linea",
  mist: "bg-niebla",
  jade: "bg-jade-suave",
  ink: "bg-tinta text-blanco",
};

/** Bloque de contenido. La jerarquía la da el tono de la superficie, no una sombra. */
export function Tile({
  tone = "plain",
  className = "",
  children,
  as: As = "div",
}: {
  tone?: TileTone;
  className?: string;
  children: ReactNode;
  as?: "div" | "section" | "article" | "li";
}) {
  return <As className={`rounded-[var(--radius-bloque)] p-5 sm:p-7 ${TILE[tone]} ${className}`}>{children}</As>;
}

type BadgeTone = "neutral" | "jade" | "aviso" | "alerta" | "rosa" | "tinta";

const BADGE: Record<BadgeTone, string> = {
  neutral: "bg-niebla text-tinta-2",
  jade: "bg-jade-suave text-jade-oscuro",
  aviso: "bg-aviso-suave text-aviso",
  alerta: "bg-alerta-suave text-alerta",
  rosa: "bg-rosa-suave text-rosa",
  tinta: "bg-tinta text-blanco",
};

export function Badge({ tone = "neutral", icon, children }: { tone?: BadgeTone; icon?: IconName; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs leading-none font-semibold whitespace-nowrap ${BADGE[tone]}`}
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5" strokeWidth={2.6} />}
      {children}
    </span>
  );
}

/** Cifra destacada con su etiqueta. */
export function Stat({
  label,
  value,
  unit,
  detail,
  className = "",
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: string;
  detail?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid content-start gap-1 ${className}`}>
      <p className="text-sm text-piedra">{label}</p>
      <p className="text-2xl font-medium tracking-[-0.03em] tabular-nums">
        {value}
        {unit && <span className="ml-1 text-base font-normal tracking-normal text-piedra">{unit}</span>}
      </p>
      {detail && <p className="text-sm text-piedra">{detail}</p>}
    </div>
  );
}

type NoticeTone = "info" | "jade" | "aviso" | "alerta";

const NOTICE: Record<NoticeTone, { cls: string; icon: IconName }> = {
  info: { cls: "bg-niebla text-tinta", icon: "info" },
  jade: { cls: "bg-jade-suave text-tinta", icon: "check" },
  aviso: { cls: "bg-aviso-suave text-tinta", icon: "alert" },
  alerta: { cls: "bg-alerta-suave text-tinta", icon: "alert" },
};

const NOTICE_ICON: Record<NoticeTone, string> = {
  info: "text-tinta-2",
  jade: "text-jade",
  aviso: "text-aviso",
  alerta: "text-alerta",
};

/** Aviso en línea. `live` lo anuncia a lectores de pantalla cuando aparece. */
export function Notice({
  tone = "info",
  title,
  children,
  live,
  className = "",
}: {
  tone?: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  live?: "polite" | "assertive";
  className?: string;
}) {
  const n = NOTICE[tone];
  return (
    <div
      role={live === "assertive" ? "alert" : live ? "status" : undefined}
      className={`flex gap-3 rounded-2xl p-4 ${n.cls} ${className}`}
    >
      <Icon name={n.icon} className={`mt-0.5 h-5 w-5 ${NOTICE_ICON[tone]}`} />
      <div className="grid gap-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-tinta-2">{children}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="grid justify-items-start gap-2 rounded-2xl bg-niebla p-5">
      <p className="font-semibold">{title}</p>
      {children && <p className="text-sm text-piedra">{children}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton rounded-xl bg-niebla-2 ${className}`} />;
}
