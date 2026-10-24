import { buttonClass } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { updatePatient } from "@/app/actions/panel";
import { Badge } from "@/components/ui/surface";
import { Card, PageHeader, PatientStatusPill, TextLink, WaButton, TableScroll } from "@/components/panel/ui";
import { WeightChart } from "@/components/weight-chart";
import { MOOD_SCALE, SYMPTOM_SCALE, WARNING_SIGNS } from "@/lib/checkin";
import { site } from "@/lib/config";
import { DEPOSIT_LABELS, PATIENT_STATUS_LABELS, type DepositStatus, type PatientStatus } from "@/lib/data/types";
import { getSnapshot } from "@/lib/data/snapshot";
import { formatDateMx, programWeek, todayMx } from "@/lib/dates";
import { channelLabel } from "@/lib/metrics";
import { formatMxPhone } from "@/lib/phone";
import { uuidSchema } from "@/lib/validation";
import { waLink } from "@/lib/whatsapp";

const DOSE: Record<string, string> = { si: "Sí", no: "No", no_aplica: "No aplica" };

export default async function PatientDetail({ params }: PageProps<"/panel/pacientes/[id]">) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  const data = await getSnapshot();
  const p = data.patients.find((x) => x.id === id);
  if (!p) notFound();
  const today = todayMx();
  const week = programWeek(p.startDate, today);
  const checkins = data.checkins.filter((c) => c.patientId === id).sort((a, b) => b.week - a.week);
  const points = checkins.filter((c) => c.weightKg !== null).map((c) => ({ week: c.week, weightKg: c.weightKg! }));

  return (
    <>
      <PageHeader title={p.displayName}>
        <div className="flex flex-wrap items-center gap-2">
          <PatientStatusPill status={p.status} />
          <WaButton href={waLink(p.phone, `Hola, ${p.displayName.split(" ")[0]}. Soy del equipo de ${site.brand}. `)}>
            Escribir
          </WaButton>
        </div>
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card
          title="Peso por semana"
          action={
            p.status === "activo" ? (
              <span className="text-piedra">
                Semana {week}
                {week > 12 ? ", después del programa base de 12" : " de 12"}
              </span>
            ) : undefined
          }
        >
          <WeightChart points={points} currentWeek={p.status === "activo" ? week : undefined} />
        </Card>
        <Card title="Datos del programa">
          <dl className="grid gap-1.5">
            <div className="flex justify-between gap-3">
              <dt className="text-piedra">Inicio</dt>
              <dd>{formatDateMx(p.startDate)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-piedra">Celular</dt>
              <dd>{formatMxPhone(p.phone)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-piedra">Correo</dt>
              <dd className="truncate">{p.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-piedra">Canal</dt>
              <dd>{channelLabel(p.channel)}</dd>
            </div>
            {p.leadId && (
              <div className="flex justify-between gap-3">
                <dt className="text-piedra">Registro</dt>
                <dd>
                  <TextLink href={`/panel/leads/${p.leadId}`}>Ver cuestionario</TextLink>
                </dd>
              </div>
            )}
          </dl>
          <form action={updatePatient} className="mt-5 grid gap-3">
            <input type="hidden" name="id" value={p.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid content-start gap-2">
                <label htmlFor="status" className="font-semibold">
                  Estado
                </label>
                <select id="status" name="status" defaultValue={p.status} className="control">
                  {(Object.keys(PATIENT_STATUS_LABELS) as PatientStatus[]).map((k) => (
                    <option key={k} value={k}>
                      {PATIENT_STATUS_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid content-start gap-2">
                <label htmlFor="deposit" className="font-semibold">
                  Depósito
                </label>
                <select id="deposit" name="deposit" defaultValue={p.deposit} className="control">
                  {(Object.keys(DEPOSIT_LABELS) as DepositStatus[]).map((k) => (
                    <option key={k} value={k}>
                      {DEPOSIT_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid content-start gap-2">
              <label htmlFor="dropReason" className="font-semibold">
                Motivo de baja o pausa
              </label>
              <input id="dropReason" name="dropReason" defaultValue={p.dropReason ?? ""} className="control" />
              <p className="text-sm text-piedra">Sirve para entender por qué se van. Sin datos clínicos.</p>
            </div>
            <button className={`${buttonClass({ variant: "secondary" })} justify-self-start`}>Guardar cambios</button>
          </form>
        </Card>
      </div>

      <Card title="Check-ins" className="mt-5">
        {checkins.length === 0 ? (
          <p className="text-piedra">Aún no registra check-ins.</p>
        ) : (
          <TableScroll label="Check-ins del paciente" minWidth="48rem">
            <table className="w-full text-left tabular-nums">
              <thead className="text-sm text-piedra">
                <tr className="border-b border-linea">
                  <th className="py-2 pr-4 font-bold">Semana</th>
                  <th className="py-2 pr-4 text-right font-bold">Peso</th>
                  <th className="py-2 pr-4 font-bold">Dosis</th>
                  <th className="py-2 pr-4 font-bold">Náusea</th>
                  <th className="py-2 pr-4 font-bold">Estreñimiento</th>
                  <th className="py-2 pr-4 font-bold">Ánimo</th>
                  <th className="py-2 pr-4 text-right font-bold">Agua</th>
                  <th className="py-2 pr-4 text-right font-bold">Fuerza</th>
                  <th className="py-2 font-bold">Notas</th>
                </tr>
              </thead>
              <tbody>
                {checkins.map((c) => (
                  <tr
                    key={c.id}
                    className={`border-b border-linea align-top last:border-0 ${c.flagged ? "bg-alerta-suave" : ""}`}
                  >
                    <td className="py-2 pr-4 font-bold">{c.week}</td>
                    <td className="py-2 pr-4 text-right">{c.weightKg !== null ? c.weightKg.toFixed(1) : "—"}</td>
                    <td className="py-2 pr-4">{c.tookDose ? DOSE[c.tookDose] : "—"}</td>
                    <td className="py-2 pr-4">{c.nausea !== null ? SYMPTOM_SCALE[c.nausea] : "—"}</td>
                    <td className="py-2 pr-4">{c.constipation !== null ? SYMPTOM_SCALE[c.constipation] : "—"}</td>
                    <td className="py-2 pr-4">{c.mood !== null ? MOOD_SCALE[c.mood - 1] : "—"}</td>
                    <td className="py-2 pr-4 text-right">{c.waterLiters !== null ? `${c.waterLiters} L` : "—"}</td>
                    <td className="py-2 pr-4 text-right">{c.strengthSessions ?? "—"}</td>
                    <td className="py-2">
                      {c.warningSigns.map((w) => (
                        <Badge key={w} tone="alerta">
                          {WARNING_SIGNS[w as keyof typeof WARNING_SIGNS] ?? w}
                        </Badge>
                      ))}
                      {c.note && <p className="text-sm">{c.note}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        )}
      </Card>
    </>
  );
}
