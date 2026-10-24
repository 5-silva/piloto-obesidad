"use client";

import { useEffect, useId, useRef, useState } from "react";

export function kg(v: number): string {
  return `${v.toFixed(1)} kg`;
}

export type WeightPoint = { week: number; weightKg: number };

// Peso por semana: una sola serie, línea de 2 px, puntos de 8 px, cuadrícula tenue.
// Al pasar el cursor o tocar, muestra la semana y el peso. Incluye tabla accesible.
export function WeightChart({
  points,
  weeks = 12,
  currentWeek,
  showChange = true,
}: {
  points: WeightPoint[];
  weeks?: number;
  currentWeek?: number;
  showChange?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(640);
  const box = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const hasData = points.length > 0;

  // Dibuja a la escala real del contenedor para que el texto no se encoja en celular.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasData]);
  const sorted = [...points].sort((a, b) => a.week - b.week);
  const maxWeek = Math.max(weeks, ...sorted.map((p) => p.week), currentWeek ?? 0);

  if (sorted.length === 0) {
    return <p className="rounded-lg bg-niebla p-4 text-piedra">Tu gráfica aparece con tu primer check-in.</p>;
  }

  const W = width;
  const H = width < 480 ? 200 : 240;
  const pad = { l: 36, r: 10, t: 14, b: 28 };
  const values = sorted.map((p) => p.weightKg);
  const lo = Math.floor(Math.min(...values) - 1);
  const hi = Math.ceil(Math.max(...values) + 1);
  const x = (w: number) => pad.l + ((w - 1) / Math.max(1, maxWeek - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + ((hi - v) / Math.max(1, hi - lo)) * (H - pad.t - pad.b);
  const step = Math.max(1, Math.ceil((hi - lo) / 4));
  const ticks: number[] = [];
  for (let v = lo; v <= hi; v += step) ticks.push(v);
  const path = sorted.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.week).toFixed(1)},${y(p.weightKg).toFixed(1)}`).join(" ");
  const active = hover !== null ? sorted.find((p) => p.week === hover) : null;
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const diff = Math.round((last.weightKg - first.weightKg) * 10) / 10;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let best = sorted[0];
    for (const p of sorted) if (Math.abs(x(p.week) - px) < Math.abs(x(best.week) - px)) best = p;
    setHover(best.week);
  }

  return (
    <figure>
      <figcaption id={titleId} className="sr-only">
        Peso por semana. Lunes {first.week}: {kg(first.weightKg)}. Lunes {last.week}: {kg(last.weightKg)}.
      </figcaption>
      <div ref={box} className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-pan-y"
          role="img"
          aria-labelledby={titleId}
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--color-linea)" strokeWidth="1" />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="13" fill="var(--color-piedra)">
                {t}
              </text>
            </g>
          ))}
          {Array.from({ length: maxWeek }, (_, i) => i + 1)
            .filter((w) => w === 1 || w === maxWeek || w === currentWeek || (width >= 480 ? w % 2 === 0 : w % 3 === 0))
            .map((w) => (
              <text
                key={w}
                x={x(w)}
                y={H - 10}
                textAnchor="middle"
                fontSize="13"
                fill={w === currentWeek ? "var(--color-rosa)" : "var(--color-piedra)"}
                fontWeight={w === currentWeek ? 700 : 400}
              >
                {w}
              </text>
            ))}
          {active && (
            <line
              x1={x(active.week)}
              x2={x(active.week)}
              y1={pad.t}
              y2={H - pad.b}
              stroke="var(--color-tinta-2)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}
          <path d={path} fill="none" stroke="var(--color-jade)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {sorted.map((p) => (
            <circle
              key={p.week}
              cx={x(p.week)}
              cy={y(p.weightKg)}
              r={p.week === hover ? 6 : 4}
              fill="var(--color-jade)"
              stroke="var(--color-blanco)"
              strokeWidth="2"
            />
          ))}
        </svg>
        {active && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 rounded-md bg-tinta px-2 py-1 text-sm font-bold whitespace-nowrap text-blanco"
            style={{ left: `${(x(active.week) / W) * 100}%`, top: `${Math.max(0, (y(active.weightKg) / H) * 100 - 22)}%` }}
          >
            Lunes {active.week}: {kg(active.weightKg)}
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-piedra">
        Lunes del programa en el eje horizontal y kilos en el vertical.{" "}
        {showChange && sorted.length > 1 && (
          <span>
            Cambio desde el lunes {first.week}:{" "}
            <strong className="text-tinta">
              {diff > 0 ? "+" : ""}
              {kg(diff)}
            </strong>
            .
          </span>
        )}
      </p>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-piedra underline">Ver como tabla</summary>
        <table className="mt-2 tabular-nums">
          <thead>
            <tr>
              <th className="pr-6 text-left">Lunes</th>
              <th className="text-left">Peso</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.week}>
                <td className="pr-6">{p.week}</td>
                <td>{kg(p.weightKg)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
