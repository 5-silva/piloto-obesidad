import { milestones } from "@/content/landing";

// La pieza central de la landing: las 12 semanas como un calendario de
// constancia. Cada casilla es un check-in; las de color llevan un hito.
// Se llenan una vez al cargar, en orden, y se quedan quietas.
export function WeekTrack() {
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <figure className="rounded-2xl border border-linea bg-blanco p-5 sm:p-6">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="font-bold">Tus 12 semanas</span>
        <span className="hint">un check-in por semana</span>
      </figcaption>
      <ol className="mt-4 grid grid-cols-6 gap-2 sm:gap-2.5" aria-label="Semanas del programa">
        {weeks.map((w) => {
          const m = milestones[w];
          return (
            <li
              key={w}
              className={`week-cell relative aspect-square rounded-lg ${m ? "bg-jade text-blanco" : "bg-hoja text-jade-oscuro"}`}
              style={{ animationDelay: `${120 + w * 70}ms` }}
              aria-label={m ? `Semana ${w}: ${m.title}` : `Semana ${w}: check-in`}
            >
              <span className="absolute left-1.5 top-1 text-[0.8rem] font-bold leading-none sm:left-2 sm:top-1.5">{w}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute bottom-1.5 right-1.5 h-4 w-4 sm:h-5 sm:w-5">
                <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {w === 1 && (
                <span className="absolute -top-2 -right-2 h-3.5 w-3.5 rounded-full border-2 border-blanco bg-rosa" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <dl className="mt-5 grid gap-3">
        {Object.entries(milestones).map(([week, m]) => (
          <div key={week} className="grid grid-cols-[6.25rem_1fr] gap-3">
            <dt className="font-bold text-jade-oscuro">Semana {week}</dt>
            <dd>
              <span className="font-bold">{m.title}.</span> <span className="text-piedra">{m.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
