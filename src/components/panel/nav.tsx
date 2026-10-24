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
    <nav aria-label="Panel" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {LINKS.map((l) => {
        const active = l.href === "/panel" ? path === "/panel" : path.startsWith(l.href);
        const count = counts[l.href];
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 font-bold ${
              active ? "bg-anil text-blanco" : "text-anil-suave hover:bg-hoja"
            }`}
          >
            {l.label}
            {count ? (
              <span className={`rounded-full px-2 text-sm ${active ? "bg-blanco text-anil" : "bg-rosa text-blanco"}`}>{count}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
