import { buttonClass } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { saveLeadNotes, setLeadStatus } from "@/app/actions/panel";
import { ActivateForm } from "@/components/panel/activate-form";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/surface";
import { Card, LeadStatusPill, PageHeader, TextLink, WaButton } from "@/components/panel/ui";
import { site } from "@/lib/config";
import { GLP1_LABELS, LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/data/types";
import { getSnapshot } from "@/lib/data/snapshot";
import { formatDateMx, nextMonday, todayMx } from "@/lib/dates";
import { channelLabel, channelOf } from "@/lib/metrics";
import { formatMxPhone } from "@/lib/phone";
import { COMORBIDITIES, FLAG_LABELS } from "@/lib/screening";
import { uuidSchema } from "@/lib/validation";
import { templates, waLink } from "@/lib/whatsapp";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-3 py-1.5">
      <dt className="text-piedra">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function LeadDetail({ params }: PageProps<"/panel/leads/[id]">) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  const data = await getSnapshot();
  const lead = data.leads.find((l) => l.id === id);
  if (!lead) notFound();
  const s = data.screenings.find((x) => x.leadId === id);
  const patient = data.patients.find((p) => p.leadId === id);
  const screeningUrl = `${site.url}/tamizaje/${lead.screeningToken}`;

  return (
    <>
      <PageHeader title={lead.name}>
        <LeadStatusPill status={lead.status} />
      </PageHeader>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card
          title="Contacto"
          action={<WaButton href={waLink(lead.phone, templates.firstContact(lead.name, screeningUrl))}>Escribir</WaButton>}
        >
          <dl>
            <Row label="Celular">{formatMxPhone(lead.phone)}</Row>
            <Row label="Correo">{lead.email}</Row>
            <Row label="Estado">{lead.state ?? "—"}</Row>
            <Row label="Medicamento">{GLP1_LABELS[lead.glp1]}</Row>
            <Row label="Canal">
              {channelLabel(channelOf(lead))}
              {lead.refCode && <span className="text-piedra"> ({lead.refCode})</span>}
              {lead.utmCampaign && <span className="text-piedra">, campaña {lead.utmCampaign}</span>}
            </Row>
            <Row label="Registro">{formatDateMx(lead.createdAt.slice(0, 10))}</Row>
            <Row label="Cuestionario">
              <CopyButton text={screeningUrl} label="Copiar liga" />
            </Row>
          </dl>
        </Card>

        <Card title="Cuestionario">
          {s ? (
            <>
              {s.flags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {s.flags.map((f) => (
                    <Badge key={f} tone={s.result === "no_elegible" ? "neutral" : "aviso"}>
                      {FLAG_LABELS[f] ?? f}
                    </Badge>
                  ))}
                </div>
              )}
              <dl>
                <Row label="Edad y sexo">
                  {s.age} años{s.sex ? `, ${s.sex}` : ""}
                </Row>
                <Row label="Estatura y peso">
                  {s.heightCm} cm, {s.weightKg} kg
                </Row>
                <Row label="IMC">
                  <strong>{s.bmi}</strong>
                </Row>
                <Row label="Cintura">{s.waistCm ? `${s.waistCm} cm` : "—"}</Row>
                <Row label="Enfermedades">
                  {s.comorbidities.length
                    ? s.comorbidities.map((c) => COMORBIDITIES[c as keyof typeof COMORBIDITIES] ?? c).join("; ")
                    : "Ninguna"}
                </Row>
                <Row label="Medicamentos">{s.medications ?? "—"}</Row>
                <Row label="Contestó">{formatDateMx(s.createdAt.slice(0, 10))}</Row>
              </dl>
              <p className="mt-3 text-sm text-piedra">Orientativo para la valoración. El médico confirma en consulta.</p>
            </>
          ) : (
            <p className="text-piedra">Aún no contesta el cuestionario.</p>
          )}
        </Card>

        <Card title="Seguimiento">
          <form action={setLeadStatus} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={lead.id} />
            <div className="grid content-start gap-2">
              <label htmlFor="status" className="font-semibold">
                Estado
              </label>
              <select id="status" name="status" defaultValue={lead.status} className="control">
                {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((k) => (
                  <option key={k} value={k}>
                    {LEAD_STATUS_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
            <button className={buttonClass({ variant: "secondary" })}>Guardar estado</button>
          </form>
          <form action={saveLeadNotes} className="mt-5 grid gap-3">
            <input type="hidden" name="id" value={lead.id} />
            <div className="grid content-start gap-2">
              <label htmlFor="notes" className="font-semibold">
                Notas internas
              </label>
              <textarea id="notes" name="notes" rows={4} defaultValue={lead.notes ?? ""} className="control" />
              <p className="text-sm text-piedra">Sin datos clínicos: esos van en el expediente del médico.</p>
            </div>
            <button className={`${buttonClass({ variant: "secondary" })} justify-self-start`}>Guardar notas</button>
          </form>
        </Card>

        <Card title="Paciente">
          {patient ? (
            <p>
              Ya es paciente. <TextLink href={`/panel/pacientes/${patient.id}`}>Ver seguimiento</TextLink>
            </p>
          ) : lead.status === "agendado" || lead.status === "elegible" || lead.status === "revisar" ? (
            <>
              <p className="mb-4 text-tinta-2">
                Actívalo después de la valoración, solo si el médico lo aprobó. Se crea su acceso al portal con este correo.
              </p>
              <ActivateForm leadId={lead.id} today={nextMonday(todayMx())} />
            </>
          ) : (
            <p className="text-piedra">Se activa después de la valoración médica.</p>
          )}
        </Card>
      </div>
    </>
  );
}
