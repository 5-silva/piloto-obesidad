// La misma tira de 12 semanas de la landing, ahora con los datos reales del paciente.
export function ProgressStrip({ done, current, weeks = 12 }: { done: Set<number>; current: number; weeks?: number }) {
  const total = Math.max(weeks, current);
  return (
    <ol className="grid grid-cols-6 gap-1.5 sm:grid-cols-12" aria-label="Tus semanas">
      {Array.from({ length: total }, (_, i) => i + 1).map((w) => {
        const isDone = done.has(w);
        const isCurrent = w === current;
        const label = `Semana ${w}: ${isDone ? "check-in hecho" : isCurrent ? "semana actual, pendiente" : w < current ? "sin check-in" : "por venir"}`;
        return (
          <li
            key={w}
            aria-label={label}
            aria-current={isCurrent ? "step" : undefined}
            className={`relative flex aspect-square items-start rounded-md p-1 text-[0.8rem] font-bold leading-none ${
              isDone ? "bg-jade text-blanco" : w < current ? "bg-papel text-piedra ring-1 ring-linea" : "bg-hoja text-jade-oscuro"
            } ${isCurrent ? "ring-2 ring-rosa ring-offset-2 ring-offset-blanco" : ""}`}
          >
            {w}
          </li>
        );
      })}
    </ol>
  );
}
