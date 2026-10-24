import { Card, EmptyState, PageHeader, PatientStatusPill, TextLink } from "@/components/panel/ui";
import { DEPOSIT_LABELS } from "@/lib/data/types";
import { getSnapshot } from "@/lib/data/snapshot";
import { formatDateMx, programWeek, todayMx } from "@/lib/dates";
import { channelLabel } from "@/lib/metrics";

export default async function PatientsPage() {
  const today = todayMx();
  const data = await getSnapshot();
  const rows = data.patients
    .map((p) => {
      const cs = data.checkins.filter((c) => c.patientId === p.id).sort((a, b) => a.week - b.week);
      const weights = cs.filter((c) => c.weightKg !== null);
      const change =
        weights.length > 1 ? ((weights[weights.length - 1].weightKg! - weights[0].weightKg!) / weights[0].weightKg!) * 100 : null;
      return { p, week: programWeek(p.startDate, today), last: cs[cs.length - 1], count: cs.length, change };
    })
    .sort((a, b) => (a.p.status === "activo" ? 0 : 1) - (b.p.status === "activo" ? 0 : 1) || b.week - a.week);

  return (
    <>
      <PageHeader title="Pacientes">
        <p className="text-piedra">{data.patients.filter((p) => p.status === "activo").length} activos</p>
      </PageHeader>
      <Card>
        {rows.length === 0 ? (
          <EmptyState>Aún no hay pacientes. Se activan desde la lista de espera después de la valoración.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[50rem] text-left tabular-nums">
              <thead className="text-sm text-piedra">
                <tr className="border-b border-linea">
                  <th className="py-2 pr-4 font-bold">Paciente</th>
                  <th className="py-2 pr-4 font-bold">Estado</th>
                  <th className="py-2 pr-4 text-right font-bold">Semana</th>
                  <th className="py-2 pr-4 text-right font-bold">Check-ins</th>
                  <th className="py-2 pr-4 font-bold">Último</th>
                  <th className="py-2 pr-4 text-right font-bold">Cambio de peso</th>
                  <th className="py-2 pr-4 font-bold">Depósito</th>
                  <th className="py-2 font-bold">Canal</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ p, week, last, count, change }) => (
                  <tr key={p.id} className="border-b border-linea last:border-0">
                    <td className="py-2.5 pr-4">
                      <TextLink href={`/panel/pacientes/${p.id}`}>{p.displayName}</TextLink>
                    </td>
                    <td className="py-2.5 pr-4">
                      <PatientStatusPill status={p.status} />
                    </td>
                    <td className="py-2.5 pr-4 text-right">{p.status === "activo" ? week : "—"}</td>
                    <td className="py-2.5 pr-4 text-right">{count}</td>
                    <td className="py-2.5 pr-4">
                      {last ? (
                        <span className={last.flagged ? "font-bold text-alerta" : ""}>
                          Semana {last.week}
                          {last.flagged ? ", con alerta" : ""}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2.5 pr-4 text-right">{change === null ? "—" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`}</td>
                    <td className="py-2.5 pr-4">{DEPOSIT_LABELS[p.deposit]}</td>
                    <td className="py-2.5">{channelLabel(p.channel)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <p className="mt-3 text-sm text-piedra">Inicio más antiguo: {rows.length ? formatDateMx(rows.map((r) => r.p.startDate).sort()[0]) : "—"}.</p>
    </>
  );
}
