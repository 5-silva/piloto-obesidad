import { Icon } from "@/components/ui/icon";

// La unidad del producto: doce lunes, agrupados en los tres meses del plan.
// En la landing se llena en orden al cargar; en el portal muestra el avance real.

export const MILESTONES: Record<number, string> = {
  1: "Médico",
  2: "Nutrición",
  4: "Revisión",
  8: "Ajuste",
  12: "Cierre",
};

type CellState = "done" | "current" | "missed" | "future";

export function TwelveMondays({
  done,
  current,
  animate = false,
  showMilestones = true,
}: {
  done?: Set<number>;
  current?: number;
  animate?: boolean;
  showMilestones?: boolean;
}) {
  const state = (w: number): CellState => {
    if (!done) return "done"; // vista de ejemplo: todas registradas
    if (done.has(w)) return "done";
    if (w === current) return "current";
    if (current && w < current) return "missed";
    return "future";
  };
  const label = (w: number, s: CellState) =>
    `Lunes ${w}${MILESTONES[w] ? `, ${MILESTONES[w].toLowerCase()}` : ""}: ${
      { done: "registrado", current: "esta semana, pendiente", missed: "sin registro", future: "por venir" }[s]
    }`;

  return (
    <div>
      <ol className="grid gap-y-2.5" aria-label="Tus 12 lunes">
        {[0, 1, 2].map((month) => (
          <li key={month} className="grid grid-cols-[3.25rem_1fr] items-center gap-2 sm:grid-cols-[3.75rem_1fr]">
            <span className="text-xs font-semibold text-piedra">Mes {month + 1}</span>
            <ol className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {[1, 2, 3, 4].map((i) => {
                const w = month * 4 + i;
                const s = state(w);
                const milestone = showMilestones ? MILESTONES[w] : undefined;
                return (
                  <li
                    key={w}
                    aria-label={label(w, s)}
                    aria-current={s === "current" ? "step" : undefined}
                    className={`relative flex aspect-[5/4] flex-col justify-between rounded-xl p-2 sm:aspect-[4/3] sm:p-2.5 ${
                      s === "done"
                        ? "bg-jade text-blanco"
                        : s === "current"
                          ? "bg-blanco text-tinta shadow-[inset_0_0_0_2px_var(--color-rosa)]"
                          : s === "missed"
                            ? "bg-niebla text-piedra"
                            : "bg-niebla text-tinta-2"
                    } ${animate ? "lunes-fill" : ""}`}
                    style={animate ? { animationDelay: `${250 + w * 85}ms` } : undefined}
                  >
                    <span className="flex items-start justify-between">
                      <span className="text-base leading-none font-semibold tabular-nums sm:text-lg">{w}</span>
                      {s === "done" && <Icon name="check" className="h-4 w-4 opacity-90" strokeWidth={2.8} />}
                      {s === "current" && <span className="h-2 w-2 rounded-full bg-rosa" aria-hidden="true" />}
                    </span>
                    {milestone && (
                      <>
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-80 sm:hidden" />
                        <span
                          className={`hidden truncate text-xs leading-tight font-semibold sm:block ${s === "done" ? "text-blanco" : "text-piedra"}`}
                        >
                          {milestone}
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
      {showMilestones && (
        <p className="mt-3 flex items-center gap-2 text-xs text-piedra sm:hidden">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-piedra" />
          Lunes con valoración, plan o revisión
        </p>
      )}
    </div>
  );
}
