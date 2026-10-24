import { setLeadStatus } from "@/app/actions/panel";
import { Card, EmptyState, ListRow, PageHeader, TextLink, WaButton, smallButton } from "@/components/panel/ui";
import { Badge, Notice } from "@/components/ui/surface";
import { WARNING_SIGNS } from "@/lib/checkin";
import { CRISIS_LINE, site } from "@/lib/config";
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

function Count({ n }: { n: number }) {
  return <span className="ml-2 rounded-full bg-niebla px-2 py-0.5 text-sm font-semibold text-tinta-2 tabular-nums">{n}</span>;
}

export default async function TodayPage() {
  const today = todayMx();
  const data = await getSnapshot();
  const t = todayTasks(data, today);
  const screeningByLead = new Map(data.screenings.map((s) => [s.leadId, s]));

  return (
    <>
      <PageHeader title="Hoy">
        <p className="text-sm text-piedra">{formatDateMx(today)}. Trabaja de arriba abajo.</p>
      </PageHeader>

      <div className="grid gap-5">
        <Card
          title={
            <>
              Alertas de check-in <Count n={t.flagged.length} />
            </>
          }
        >
          {t.flagged.length === 0 ? (
            <EmptyState title="Sin alertas en los últimos 7 días." />
          ) : (
            <ul className="divide-y divide-linea">
              {t.flagged.map(({ patient, checkin }) => (
                <ListRow
                  key={checkin.id}
                  actions={
                    <WaButton href={waLink(patient.phone, templates.followUpFlag(patient.displayName))}>Escribir</WaButton>
                  }
                >
                  <p>
                    <TextLink href={`/panel/pacientes/${patient.id}`}>{patient.displayName}</TextLink>{" "}
                    <span className="text-sm text-piedra">
                      lunes {checkin.week}, {ago(checkin.createdAt, today)}
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {flagReasons(checkin).map((r) => (
                      <Badge key={r} tone="alerta" icon="alert">
                        {r}
                      </Badge>
                    ))}
                  </div>
                  {checkin.note && <p className="mt-2 text-sm text-tinta-2">«{checkin.note}»</p>}
                </ListRow>
              ))}
            </ul>
          )}
          <Notice className="mt-5">
            Con señales de alarma, el médico decide el siguiente paso. Si la persona habla de hacerse daño, dale la{" "}
            {CRISIS_LINE.name} ({CRISIS_LINE.phone}) y avisa al médico de inmediato.
          </Notice>
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card
            title={
              <>
                Nuevos en la lista <Count n={t.newLeads.length} />
              </>
            }
          >
            {t.newLeads.length === 0 ? (
              <EmptyState title="No hay registros nuevos." />
            ) : (
              <ul className="divide-y divide-linea">
                {t.newLeads.map((l) => (
                  <ListRow
                    key={l.id}
                    actions={
                      <>
                        <WaButton
                          href={waLink(l.phone, templates.firstContact(l.name, `${site.url}/tamizaje/${l.screeningToken}`))}
                        >
                          Primer mensaje
                        </WaButton>
                        <form action={setLeadStatus}>
                          <input type="hidden" name="id" value={l.id} />
                          <button name="status" value="tamizaje_enviado" className={smallButton}>
                            Ya le escribí
                          </button>
                        </form>
                      </>
                    }
                  >
                    <TextLink href={`/panel/leads/${l.id}`}>{l.name}</TextLink>
                    <p className="mt-0.5 text-sm text-piedra">
                      {channelLabel(channelOf(l))}, {ago(l.createdAt, today)}. {GLP1_LABELS[l.glp1]}.
                    </p>
                  </ListRow>
                ))}
              </ul>
            )}
          </Card>

          <Card
            title={
              <>
                Por agendar valoración <Count n={t.toSchedule.length} />
              </>
            }
          >
            {t.toSchedule.length === 0 ? (
              <EmptyState title="Nadie pendiente de agendar." />
            ) : (
              <ul className="divide-y divide-linea">
                {t.toSchedule.map((l) => {
                  const s = screeningByLead.get(l.id);
                  return (
                    <ListRow
                      key={l.id}
                      actions={
                        <>
                          <WaButton href={waLink(l.phone, templates.schedule(l.name))}>Agendar</WaButton>
                          <form action={setLeadStatus}>
                            <input type="hidden" name="id" value={l.id} />
                            <button name="status" value="agendado" className={smallButton}>
                              Ya agendó
                            </button>
                          </form>
                        </>
                      }
                    >
                      <TextLink href={`/panel/leads/${l.id}`}>{l.name}</TextLink>
                      <p className="mt-0.5 text-sm text-piedra">IMC {s?.bmi ?? "—"}</p>
                      {l.status === "revisar" && s && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {s.flags.map((f) => (
                            <Badge key={f} tone="aviso">
                              {FLAG_LABELS[f] ?? f}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </ListRow>
                  );
                })}
              </ul>
            )}
            <p className="mt-5 text-xs text-piedra">
              Lo marcado en amarillo necesita el visto bueno del médico antes de agendar.
            </p>
          </Card>
        </div>

        <Card
          title={
            <>
              Sin check-in esta semana <Count n={t.missingCheckin.length} />
            </>
          }
        >
          {t.missingCheckin.length === 0 ? (
            <EmptyState title="Todos los pacientes activos ya registraron su semana." />
          ) : (
            <ul className="divide-y divide-linea">
              {t.missingCheckin.map(({ patient, week, dayOfWeek }) => (
                <ListRow
                  key={patient.id}
                  actions={
                    <WaButton href={waLink(patient.phone, templates.checkinReminder(patient.displayName, week))}>
                      Recordar
                    </WaButton>
                  }
                >
                  <TextLink href={`/panel/pacientes/${patient.id}`}>{patient.displayName}</TextLink>{" "}
                  <span className="text-sm text-piedra">
                    lunes {week}, día {dayOfWeek} de 7
                  </span>
                  {dayOfWeek >= 5 && (
                    <span className="ml-2">
                      <Badge tone="rosa">Escribir hoy</Badge>
                    </span>
                  )}
                </ListRow>
              ))}
            </ul>
          )}
          <p className="mt-5 text-xs text-piedra">
            El correo automático sale el día 1 y el día 5. A partir del día 5, escribe por WhatsApp.
          </p>
        </Card>
      </div>
    </>
  );
}
