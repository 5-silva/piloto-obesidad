// Fechas como texto YYYY-MM-DD en la zona horaria de la Ciudad de México.
const TZ = "America/Mexico_City";
const DAY = 86_400_000;

export function todayMx(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);
}

function toUtc(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY);
}

export function addDays(date: string, days: number): string {
  return new Date(toUtc(date) + days * DAY).toISOString().slice(0, 10);
}

/** Semana del programa: la semana 1 empieza el día de inicio. Igual que en la base. */
export function programWeek(startDate: string, today: string): number {
  return Math.max(1, Math.floor(daysBetween(startDate, today) / 7) + 1);
}

/** Semanas completas transcurridas desde el inicio. */
export function weeksCompleted(startDate: string, today: string): number {
  return Math.max(0, Math.floor(daysBetween(startDate, today) / 7));
}

export function formatDateMx(date: string): string {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(toUtc(date)));
}

export function monthStart(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

/** Hoy si es lunes; si no, el lunes siguiente. Las semanas del programa arrancan en lunes. */
export function nextMonday(date: string): string {
  const day = new Date(toUtc(date)).getUTCDay(); // 0 domingo … 1 lunes
  return addDays(date, (8 - day) % 7);
}
