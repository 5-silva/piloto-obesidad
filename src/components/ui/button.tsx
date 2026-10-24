import Link from "next/link";
import type { ComponentProps } from "react";
import { Spinner } from "./icon";

type Variant = "primary" | "secondary" | "quiet" | "inverse" | "danger";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none whitespace-nowrap no-underline transition-[background-color,box-shadow,color,transform] duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-tinta text-blanco hover:bg-tinta-2",
  secondary:
    "bg-blanco text-tinta shadow-[inset_0_0_0_1.5px_var(--color-linea-2)] hover:shadow-[inset_0_0_0_1.5px_var(--color-tinta)]",
  quiet: "text-tinta underline decoration-linea-2 underline-offset-4 hover:decoration-tinta px-0!",
  inverse: "bg-blanco text-tinta hover:bg-niebla",
  danger: "bg-alerta text-blanco hover:bg-[#931c13]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-7 text-base",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  full = false,
}: { variant?: Variant; size?: Size; full?: boolean } = {}) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${full ? "w-full" : ""}`;
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  pending?: boolean;
  pendingLabel?: string;
};

/** Botón. Con `pending` muestra un indicador, anuncia el estado y evita doble envío. */
export function Button({ variant, size, full, pending, pendingLabel, className = "", children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={`${buttonClass({ variant, size, full })} ${className}`}
    >
      {pending && <Spinner />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; full?: boolean };

export function ButtonLink({ variant, size, full, className = "", ...rest }: LinkProps) {
  return <Link {...rest} className={`${buttonClass({ variant, size, full })} ${className}`} />;
}
