import { Card, PageHeader, Pill, mxn, pct } from "@/components/panel/ui";
import { site } from "@/lib/config";
import { getSnapshot } from "@/lib/data/snapshot";
import { formatDateMx, todayMx } from "@/lib/dates";
import { channelLabel, computeMetrics, type HypothesisStatus } from "@/lib/metrics";

const STATUS: Record<HypothesisStatus, { tone: "good" | "bad" | "neutral"; label: string; icon: string }> = {
  cumple: { tone: "good", label: "Cumple", icon: "M5 12.5l4.2 4.2L19 7" },
  no_cumple: { tone: "bad", label: "No cumple aún", icon: "M7 7l10 10M17 7L7 17" },
  sin_datos: { tone: "neutral", label: "Sin datos", icon: "M6 12h12" },
};

export default async function PanelSummary() {
  const today = todayMx();
  const data = await getSnapshot();
  const m = computeMetrics(data, today, site.priceMxn);
  const maxFunnel = Math.max(1, ...m.funnel.map((f) => f.value));

  return (
    <>
      <PageHeader title="Resumen del piloto">
        <p className="text-piedra">Datos al {formatDateMx(today)}</p>
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <Card title="Hipótesis que decide la semana 16">
          <ul className="divide-y divide-linea">
            {m.hypotheses.map((h) => {
              const s = STATUS[h.status];
              return (
                <li key={h.id} className="grid gap-1 py-3 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-4">
                  <span className="font-bold text-piedra">{h.id}</span>
                  <div>
                    <p className="font-bold">{h.label}</p>
                    <p className="text-sm text-piedra">
                      Meta: {h.target}. Hoy: <span className="font-bold text-anil">{h.actual}</span>
                    </p>
                  </div>
                  <Pill tone={s.tone}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path d={s.icon} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {s.label}
                  </Pill>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Embudo">
          <ol className="grid gap-3">
            {m.funnel.map((f, i) => {
              const prev = i > 0 ? m.funnel[i - 1].value : null;
              const conv = prev ? f.value / prev : null;
              return (
                <li key={f.label} className="grid gap-1" title={`${f.label}: ${f.value}${conv !== null ? ` (${pct(conv)} del paso anterior)` : ""}`}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span>{f.label}</span>
                    <span className="tabular-nums">
                      <strong className="text-base">{f.value.toLocaleString("es-MX")}</strong>
                      {conv !== null && <span className="ml-2 text-piedra">{pct(conv)}</span>}
                    </span>
                  </div>
                  <div className="h-3 rounded-r bg-papel">
                    <div className="h-3 rounded-r bg-jade" style={{ width: `${Math.max(1, (f.value / maxFunnel) * 100)}%` }} />
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-sm text-piedra">El porcentaje compara cada paso con el anterior.</p>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {m.retention.map(({ week, result }) => (
          <Card key={week}>
            <p className="text-sm text-piedra">Retención a {week} semanas</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{pct(result.rate)}</p>
            <p className="text-sm text-piedra">
              {result.denominator > 0
                ? `${result.numerator} de ${result.denominator} pacientes con ${week} semanas o más`
                : `Nadie lleva ${week} semanas todavía`}
            </p>
            <div className="relative mt-3 h-2 rounded-r bg-papel" aria-hidden="true">
              <div className="h-2 rounded-r bg-jade" style={{ width: `${(result.rate ?? 0) * 100}%` }} />
              <div className="absolute -top-1 h-4 w-0.5 bg-anil" style={{ left: "70%" }} />
            </div>
            <p className="mt-1 text-sm text-piedra">Meta: 70%</p>
          </Card>
        ))}
        <Card>
          <p className="text-sm text-piedra">Check-in de esta semana</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{pct(m.weeklyCompliance.rate)}</p>
          <p className="text-sm text-piedra">
            {m.weeklyCompliance.numerator} de {m.weeklyCompliance.denominator} pacientes activos
          </p>
        </Card>
      </div>

      <Card title="Canales" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left tabular-nums">
            <thead className="text-sm text-piedra">
              <tr className="border-b border-linea">
                <th className="py-2 pr-4 font-bold">Canal</th>
                <th className="py-2 pr-4 text-right font-bold">Visitantes</th>
                <th className="py-2 pr-4 text-right font-bold">Lista de espera</th>
                <th className="py-2 pr-4 text-right font-bold">Conversión</th>
                <th className="py-2 pr-4 text-right font-bold">Pacientes</th>
                <th className="py-2 pr-4 text-right font-bold">Gasto</th>
                <th className="py-2 text-right font-bold">Costo por paciente</th>
              </tr>
            </thead>
            <tbody>
              {m.channels.map((c) => (
                <tr key={c.channel} className="border-b border-linea last:border-0">
                  <td className="py-2 pr-4 font-bold">{channelLabel(c.channel)}</td>
                  <td className="py-2 pr-4 text-right">{c.visitors}</td>
                  <td className="py-2 pr-4 text-right">{c.leads}</td>
                  <td className="py-2 pr-4 text-right">{pct(c.conversion)}</td>
                  <td className="py-2 pr-4 text-right">{c.patients}</td>
                  <td className="py-2 pr-4 text-right">{mxn(c.costMxn)}</td>
                  <td className={`py-2 text-right ${c.cacMxn !== null && c.cacMxn > m.cacTargetMxn ? "font-bold text-alerta" : ""}`}>
                    {mxn(c.cacMxn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-piedra">
          Meta de costo por paciente: menos de {mxn(m.cacTargetMxn)} (2 meses de margen). «Médico» agrupa las ligas con código de
          referencia; «directo» es tráfico sin origen.
        </p>
      </Card>
    </>
  );
}
