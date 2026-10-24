import { Card, PageHeader, TableScroll, mxn, pct, td, th } from "@/components/panel/ui";
import { Badge, Stat } from "@/components/ui/surface";
import { site } from "@/lib/config";
import { getSnapshot } from "@/lib/data/snapshot";
import { formatDateMx, todayMx } from "@/lib/dates";
import { channelLabel, computeMetrics, type HypothesisStatus } from "@/lib/metrics";

const STATUS: Record<HypothesisStatus, { tone: "jade" | "alerta" | "neutral"; label: string; icon: "check" | "x" | "minus" }> = {
  cumple: { tone: "jade", label: "Cumple", icon: "check" },
  no_cumple: { tone: "alerta", label: "Aún no", icon: "x" },
  sin_datos: { tone: "neutral", label: "Sin datos", icon: "minus" },
};

function Bar({ value, max, target }: { value: number; max: number; target?: number }) {
  return (
    <div className="relative h-2.5 rounded-full bg-niebla" aria-hidden="true">
      <div
        className="h-2.5 rounded-full bg-tinta"
        style={{ width: `${Math.max(value > 0 ? 2 : 0, (value / Math.max(1, max)) * 100)}%` }}
      />
      {target !== undefined && (
        <div className="absolute -top-1 h-4.5 w-0.5 rounded-full bg-rosa" style={{ left: `${target * 100}%` }} />
      )}
    </div>
  );
}

export default async function PanelSummary() {
  const today = todayMx();
  const data = await getSnapshot();
  const m = computeMetrics(data, today, site.priceMxn);
  const maxFunnel = Math.max(1, ...m.funnel.map((f) => f.value));
  const r12 = m.retention[2].result;
  const totalCost = m.channels.reduce((s, c) => s + c.costMxn, 0);
  const totalPatients = data.patients.length;

  return (
    <>
      <PageHeader title="Resumen del piloto">
        <p className="text-sm text-piedra">Datos al {formatDateMx(today)}</p>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "En lista de espera",
            value: data.leads.length,
            detail: `Conversión de la landing: ${pct(m.landingConversion.rate)}`,
          },
          { label: "Pacientes activos", value: m.funnel[5].value, detail: `${m.depositsPaid} depósitos pagados` },
          {
            label: "Retención a 12 semanas",
            value: pct(r12.rate),
            detail: r12.denominator ? `${r12.numerator} de ${r12.denominator}. Meta: 70%` : "Nadie llega aún a 12 semanas",
          },
          {
            label: "Costo por paciente",
            value: mxn(totalPatients ? totalCost / totalPatients : null),
            detail: `Meta: menos de ${mxn(m.cacTargetMxn)}`,
          },
        ].map((k) => (
          <Card key={k.label}>
            <Stat label={k.label} value={k.value} detail={k.detail} />
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Card title="Hipótesis que decide la semana 16">
          <ul className="divide-y divide-linea">
            {m.hypotheses.map((h) => {
              const s = STATUS[h.status];
              return (
                <li key={h.id} className="grid grid-cols-[2.75rem_1fr_auto] items-start gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="pt-0.5 text-sm font-semibold text-piedra">{h.id}</span>
                  <div>
                    <p className="font-semibold">{h.label}</p>
                    <p className="mt-0.5 text-sm text-piedra">Meta: {h.target}</p>
                    <p className="text-sm">
                      Hoy: <span className="font-semibold">{h.actual}</span>
                    </p>
                  </div>
                  <Badge tone={s.tone} icon={s.icon}>
                    {s.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="grid content-start gap-5">
          <Card title="Embudo">
            <ol className="grid gap-4">
              {m.funnel.map((f, i) => {
                const prev = i > 0 ? m.funnel[i - 1].value : null;
                const conv = prev ? f.value / prev : null;
                return (
                  <li key={f.label} className="grid gap-1.5">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-tinta-2">{f.label}</span>
                      <span className="tabular-nums">
                        <strong className="text-base font-semibold">{f.value.toLocaleString("es-MX")}</strong>
                        {conv !== null && <span className="ml-2 text-piedra">{pct(conv)}</span>}
                      </span>
                    </div>
                    <Bar value={f.value} max={maxFunnel} />
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs text-piedra">El porcentaje compara cada paso con el anterior.</p>
          </Card>

          <Card title="Retención">
            <ul className="grid gap-4">
              {m.retention.map(({ week, result }) => (
                <li key={week} className="grid gap-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-tinta-2">A {week} semanas</span>
                    <span className="tabular-nums">
                      <strong className="text-base font-semibold">{pct(result.rate)}</strong>
                      <span className="ml-2 text-piedra">
                        {result.denominator ? `${result.numerator} de ${result.denominator}` : "sin datos"}
                      </span>
                    </span>
                  </div>
                  <Bar value={result.rate ?? 0} max={1} target={0.7} />
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-xs text-piedra">
              <span className="h-3 w-0.5 rounded-full bg-rosa" aria-hidden="true" />
              Meta: 70%. Check-in de esta semana: {pct(m.weeklyCompliance.rate)} ({m.weeklyCompliance.numerator} de{" "}
              {m.weeklyCompliance.denominator}).
            </p>
          </Card>
        </div>
      </div>

      <Card title="Canales" className="mt-5">
        <TableScroll label="Tabla de canales" minWidth="42rem">
          <table className="w-full tabular-nums">
            <thead>
              <tr className="border-b border-linea">
                <th className={th}>Canal</th>
                <th className={`${th} text-right`}>Visitantes</th>
                <th className={`${th} text-right`}>Lista</th>
                <th className={`${th} text-right`}>Conversión</th>
                <th className={`${th} text-right`}>Pacientes</th>
                <th className={`${th} text-right`}>Gasto</th>
                <th className={`${th} pr-0 text-right`}>Costo por paciente</th>
              </tr>
            </thead>
            <tbody>
              {m.channels.map((c) => (
                <tr key={c.channel} className="border-b border-linea last:border-0">
                  <td className={`${td} font-semibold`}>{channelLabel(c.channel)}</td>
                  <td className={`${td} text-right`}>{c.visitors}</td>
                  <td className={`${td} text-right`}>{c.leads}</td>
                  <td className={`${td} text-right`}>{pct(c.conversion)}</td>
                  <td className={`${td} text-right`}>{c.patients}</td>
                  <td className={`${td} text-right`}>{mxn(c.costMxn)}</td>
                  <td
                    className={`${td} pr-0 text-right ${c.cacMxn !== null && c.cacMxn > m.cacTargetMxn ? "font-semibold text-alerta" : ""}`}
                  >
                    {mxn(c.cacMxn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
        <p className="mt-4 text-xs text-piedra">
          «Médico» agrupa las ligas con código de referencia y «Directo» es tráfico sin origen. En rojo, los canales por encima de
          la meta.
        </p>
      </Card>
    </>
  );
}
