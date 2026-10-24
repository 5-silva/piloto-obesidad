import { CostForm } from "@/components/panel/cost-form";
import { Card, EmptyState, PageHeader, mxn, TableScroll } from "@/components/panel/ui";
import { getSnapshot } from "@/lib/data/snapshot";
import { todayMx } from "@/lib/dates";
import { channelLabel } from "@/lib/metrics";

const MONTH = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric", timeZone: "UTC" });

export default async function CostsPage() {
  const data = await getSnapshot();
  const costs = [...data.costs].sort((a, b) => b.month.localeCompare(a.month) || a.channel.localeCompare(b.channel));
  const total = costs.reduce((s, c) => s + c.amountMxn, 0);
  const hours = costs.reduce((s, c) => s + c.hours, 0);

  return (
    <>
      <PageHeader title="Costos por canal" />
      <Card title="Registrar gasto del mes">
        <CostForm month={todayMx().slice(0, 7)} />
        <p className="mt-3 text-sm text-piedra">
          Incluye anuncios, comisiones y materiales. Las horas cuentan el tiempo del equipo en ese canal, por ejemplo visitas a
          consultorios.
        </p>
      </Card>
      <Card title="Registro" className="mt-5">
        {costs.length === 0 ? (
          <EmptyState title="Aún no hay gastos registrados." />
        ) : (
          <TableScroll label="Registro de costos" minWidth="36rem">
            <table className="w-full text-left tabular-nums">
              <thead className="text-sm text-piedra">
                <tr className="border-b border-linea">
                  <th className="py-2 pr-4 font-bold">Mes</th>
                  <th className="py-2 pr-4 font-bold">Canal</th>
                  <th className="py-2 pr-4 text-right font-bold">Gasto</th>
                  <th className="py-2 pr-4 text-right font-bold">Horas</th>
                  <th className="py-2 font-bold">Nota</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((c) => (
                  <tr key={c.id} className="border-b border-linea last:border-0">
                    <td className="py-2 pr-4 first-letter:uppercase">{MONTH.format(new Date(`${c.month}T00:00:00Z`))}</td>
                    <td className="py-2 pr-4 font-bold">{channelLabel(c.channel)}</td>
                    <td className="py-2 pr-4 text-right">{mxn(c.amountMxn)}</td>
                    <td className="py-2 pr-4 text-right">{c.hours}</td>
                    <td className="py-2 text-piedra">{c.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-tinta font-bold">
                  <td className="py-2 pr-4" colSpan={2}>
                    Total
                  </td>
                  <td className="py-2 pr-4 text-right">{mxn(total)}</td>
                  <td className="py-2 pr-4 text-right">{hours}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </TableScroll>
        )}
      </Card>
    </>
  );
}
