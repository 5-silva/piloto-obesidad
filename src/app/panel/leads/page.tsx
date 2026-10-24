import Link from "next/link";
import { Card, EmptyState, LeadStatusPill, PageHeader, TextLink, TableScroll } from "@/components/panel/ui";
import { formatMxPhone } from "@/lib/phone";
import { GLP1_LABELS, LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/data/types";
import { getSnapshot } from "@/lib/data/snapshot";
import { formatDateMx } from "@/lib/dates";
import { channelLabel, channelOf } from "@/lib/metrics";

const FILTERS: (LeadStatus | "todos")[] = [
  "todos",
  "nuevo",
  "tamizaje_enviado",
  "elegible",
  "revisar",
  "agendado",
  "activo",
  "no_elegible",
  "descartado",
];

export default async function LeadsPage({ searchParams }: PageProps<"/panel/leads">) {
  const { estado } = await searchParams;
  const filter = (typeof estado === "string" && FILTERS.includes(estado as LeadStatus) ? estado : "todos") as
    | LeadStatus
    | "todos";
  const data = await getSnapshot();
  const screenings = new Map(data.screenings.map((s) => [s.leadId, s]));
  const emailCount = new Map<string, number>();
  for (const l of data.leads) emailCount.set(l.email, (emailCount.get(l.email) ?? 0) + 1);
  const leads = data.leads
    .filter((l) => filter === "todos" || l.status === filter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const countBy = (s: LeadStatus | "todos") =>
    s === "todos" ? data.leads.length : data.leads.filter((l) => l.status === s).length;

  return (
    <>
      <PageHeader title="Lista de espera" />
      <nav aria-label="Filtrar por estado" className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "todos" ? "/panel/leads" : `/panel/leads?estado=${f}`}
            aria-current={filter === f ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-sm font-bold ${filter === f ? "bg-tinta text-blanco" : "bg-blanco text-tinta-2 ring-1 ring-linea hover:ring-tinta-2"}`}
          >
            {f === "todos" ? "Todos" : LEAD_STATUS_LABELS[f]} <span className="font-normal">{countBy(f)}</span>
          </Link>
        ))}
      </nav>
      <Card>
        {leads.length === 0 ? (
          <EmptyState title="No hay registros con este estado." />
        ) : (
          <TableScroll label="Lista de espera" minWidth="46rem">
            <table className="w-full text-left">
              <thead className="text-sm text-piedra">
                <tr className="border-b border-linea">
                  <th className="py-2 pr-4 font-bold">Nombre</th>
                  <th className="py-2 pr-4 font-bold">Estado</th>
                  <th className="py-2 pr-4 font-bold">Medicamento</th>
                  <th className="py-2 pr-4 font-bold">IMC</th>
                  <th className="py-2 pr-4 font-bold">Canal</th>
                  <th className="py-2 font-bold">Registro</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => {
                  const s = screenings.get(l.id);
                  return (
                    <tr key={l.id} className="border-b border-linea align-top last:border-0">
                      <td className="py-2.5 pr-4">
                        <TextLink href={`/panel/leads/${l.id}`}>{l.name}</TextLink>
                        <p className="text-sm text-piedra">
                          {formatMxPhone(l.phone)}, {l.state ?? "sin estado"}
                          {(emailCount.get(l.email) ?? 0) > 1 && <span className="font-bold text-aviso">, correo repetido</span>}
                        </p>
                      </td>
                      <td className="py-2.5 pr-4">
                        <LeadStatusPill status={l.status} />
                      </td>
                      <td className="py-2.5 pr-4 text-sm">{GLP1_LABELS[l.glp1]}</td>
                      <td className="py-2.5 pr-4 tabular-nums">{s?.bmi ?? "—"}</td>
                      <td className="py-2.5 pr-4">{channelLabel(channelOf(l))}</td>
                      <td className="py-2.5 whitespace-nowrap">{formatDateMx(l.createdAt.slice(0, 10))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>
        )}
      </Card>
    </>
  );
}
