"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/panel", label: "Resumen" },
  { href: "/panel/hoy", label: "Hoy" },
  { href: "/panel/leads", label: "Lista de espera" },
  { href: "/panel/pacientes", label: "Pacientes" },
  { href: "/panel/costos", label: "Costos por canal" },
];

export function PanelNav({ counts }: { counts: Record<string, number> }) {
  const path = usePathname();
  return (
    <nav aria-label="Panel" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-col md:overflow-visible md:p-0">
      {LINKS.map((l) => {
        const active = l.href === "/panel" ? path === "/panel" : path.startsWith(l.href);
        const count = counts[l.href];
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-10 items-center justify-between gap-3 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              active ? "bg-tinta text-blanco" : "text-tinta-2 hover:bg-niebla hover:text-tinta"
            }`}
          >
            {l.label}
            {count ? (
              <span
                className={`min-w-6 rounded-full px-1.5 text-center text-xs leading-5 ${active ? "bg-blanco text-tinta" : "bg-rosa text-blanco"}`}
              >
                {count}
                <span className="sr-only"> pendientes</span>
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
