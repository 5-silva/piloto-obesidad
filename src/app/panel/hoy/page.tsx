import { setLeadStatus } from "@/app/actions/panel";
import { Card, EmptyState, PageHeader, Pill, TextLink, WaButton } from "@/components/panel/ui";
import { WARNING_SIGNS } from "@/lib/checkin";
import { site } from "@/lib/config";
import { GLP1_LABELS, type Checkin } from "@/lib/data/types";
import { getSnapshot } from "@/lib/data/snapshot";
import { daysBetween, formatDateMx, todayMx } from "@/lib/dates";
import { channelLabel, channelOf, todayTasks } from "@/lib/metrics";
import { FLAG_LABELS } from "@/lib/screening";
import { templates, waLink } from "@/lib/whatsapp";

function flagReasons(c: Checkin): string[] {
  const out: string[] = c.warningSigns.map((w) => WARNING_SIGNS[w as keyof typeof WARNING_SIGNS] ?? w);
  if (c.mood === 1) out.push("Ánimo muy bajo");
  if (c.nausea === 3) out.push("Náusea fuerte");
  return out;
}

function ago(date: string, today: string): string {
  const d = daysBetween(date.slice(0, 10), today);
  return d <= 0 ? "hoy" : d === 1 ? "ayer" : `hace ${d} días`;
}

export default async function TodayPage() {
  const today = todayMx();
  const data = await getSnapshot();
  const t = todayTasks(data, today);
  const screeningByLead = new Map(data.screenings.map((s) => [s.leadId, s]));

  return (
    <>
      <PageHeader title="Hoy">
        <p className="text-piedra">{formatDateMx(today)}. Empieza por las alertas.</p>
      </PageHeader>

      <div className="grid gap-5">
        <Card title={`Alertas de check-in (${t.flagged.length})`}>
          {t.flagged.length === 0 ? (
            <EmptyState>Sin alertas en los últimos 7 días.</EmptyState>
          ) : (
            <ul className="divide-y divide-linea">
              {t.flagged.map(({ patient, checkin }) => (
                <li key={checkin.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p>
                      <TextLink href={`/panel/pacientes/${patient.id}`}>{patient.displayName}</TextLink>{" "}
                      <span className="text-piedra">semana {checkin.week}, {ago(checkin.createdAt, today)}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {flagReasons(checkin).map((r) => (
                        <Pill key={r} tone="bad">
                          {r}
                        </Pill>
                      ))}
                    </div>
                    {checkin.note && <p className="mt-2 text-anil-suave">«{checkin.note}»</p>}
                  </div>
                  <WaButton href={waLink(patient.phone, templates.followUpFlag(patient.displayName))}>Escribir</WaButton>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-piedra">
            Si hay señales de alarma, el médico decide el siguiente paso. Si la persona habla de hacerse daño, dale la Línea de la
            Vida (800 911 2000) y avisa al médico de inmediato.
          </p>
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card title={`Nuevos en la lista (${t.newLeads.length})`}>
            {t.newLeads.length === 0 ? (
              <EmptyState>No hay registros nuevos.</EmptyState>
            ) : (
              <ul className="divide-y divide-linea">
                {t.newLeads.map((l) => (
                  <li key={l.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <TextLink href={`/panel/leads/${l.id}`}>{l.name}</TextLink>
                      <p className="text-sm text-piedra">
                        {channelLabel(channelOf(l))}, {ago(l.createdAt, today)}. {GLP1_LABELS[l.glp1]}.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <WaButton href={waLink(l.phone, templates.firstContact(l.name, `${site.url}/tamizaje/${l.screeningToken}`))}>
                        Primer mensaje
                      </WaButton>
                      <form action={setLeadStatus}>
                        <input type="hidden" name="id" value={l.id} />
                        <button name="status" value="tamizaje_enviado" className="btn btn-secondary btn-sm">
                          Ya le escribí
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={`Por agendar valoración (${t.toSchedule.length})`}>
            {t.toSchedule.length === 0 ? (
              <EmptyState>Nadie pendiente de agendar.</EmptyState>
            ) : (
              <ul className="divide-y divide-linea">
                {t.toSchedule.map((l) => {
                  const s = screeningByLead.get(l.id);
                  return (
                    <li key={l.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <TextLink href={`/panel/leads/${l.id}`}>{l.name}</TextLink>
                        <p className="text-sm text-piedra">IMC {s?.bmi ?? "—"}</p>
                        {l.status === "revisar" && s && (
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {s.flags.map((f) => (
                              <Pill key={f} tone="warn">
                                {FLAG_LABELS[f] ?? f}
                              </Pill>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <WaButton href={waLink(l.phone, templates.schedule(l.name))}>Agendar</WaButton>
                        <form action={setLeadStatus}>
                          <input type="hidden" name="id" value={l.id} />
                          <button name="status" value="agendado" className="btn btn-secondary btn-sm">
                            Ya agendó
                          </button>
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-sm text-piedra">Los marcados «Revisar con médico» necesitan su visto bueno antes de agendar.</p>
          </Card>
        </div>

        <Card title={`Sin check-in esta semana (${t.missingCheckin.length})`}>
          {t.missingCheckin.length === 0 ? (
            <EmptyState>Todos los pacientes activos ya registraron su semana.</EmptyState>
          ) : (
            <ul className="divide-y divide-linea">
              {t.missingCheckin.map(({ patient, week, dayOfWeek }) => (
                <li key={patient.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <p>
                    <TextLink href={`/panel/pacientes/${patient.id}`}>{patient.displayName}</TextLink>{" "}
                    <span className="text-piedra">
                      semana {week}, día {dayOfWeek} de 7
                    </span>
                  </p>
                  <WaButton href={waLink(patient.phone, templates.checkinReminder(patient.displayName, week))}>Recordar</WaButton>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-piedra">El correo automático sale el día 1 y el día 5 de cada semana; escribe por WhatsApp a partir del día 5.</p>
        </Card>
      </div>
    </>
  );
}
