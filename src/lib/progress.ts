import type { Checkin } from "@/lib/data/types";

/** Lunes seguidos con check-in, contando hacia atrás desde esta semana (o la anterior si aún no registra). */
export function streak(checkins: Pick<Checkin, "week">[], currentWeek: number): number {
  const weeks = new Set(checkins.map((c) => c.week));
  let w = weeks.has(currentWeek) ? currentWeek : currentWeek - 1;
  let n = 0;
  while (w >= 1 && weeks.has(w)) {
    n++;
    w--;
  }
  return n;
}

/** Último peso registrado y cambio contra el primero. */
export function weightSummary(checkins: Pick<Checkin, "week" | "weightKg">[]) {
  const withWeight = [...checkins].filter((c) => c.weightKg !== null).sort((a, b) => a.week - b.week);
  if (withWeight.length === 0) return null;
  const first = withWeight[0];
  const last = withWeight[withWeight.length - 1];
  return {
    last: last.weightKg!,
    lastWeek: last.week,
    firstWeek: first.week,
    change: withWeight.length > 1 ? Math.round((last.weightKg! - first.weightKg!) * 10) / 10 : null,
  };
}
