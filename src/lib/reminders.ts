import type { Checkin, Patient } from "@/lib/data/types";
import { daysBetween, programWeek } from "@/lib/dates";

export type Reminder = { patient: Patient; week: number; late: boolean };

/**
 * A quién mandar recordatorio hoy: pacientes activos sin check-in de su semana
 * actual, el día 1 (se abre la semana) y el día 5 (va tarde). Máximo dos por semana.
 */
export function dueReminders(patients: Patient[], checkins: Checkin[], today: string): Reminder[] {
  const out: Reminder[] = [];
  for (const patient of patients) {
    if (patient.status !== "activo") continue;
    const days = daysBetween(patient.startDate, today);
    if (days < 0) continue;
    const dayOfWeek = (days % 7) + 1;
    if (dayOfWeek !== 1 && dayOfWeek !== 5) continue;
    const week = programWeek(patient.startDate, today);
    if (checkins.some((c) => c.patientId === patient.id && c.week === week)) continue;
    out.push({ patient, week, late: dayOfWeek === 5 });
  }
  return out;
}
