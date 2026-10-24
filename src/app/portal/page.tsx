import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { CheckinPanel } from "@/components/checkin-panel";
import { TwelveMondays } from "@/components/twelve-mondays";
import { buttonClass } from "@/components/ui/button";
import { Icon, WhatsAppIcon } from "@/components/ui/icon";
import { Stat, Tile } from "@/components/ui/surface";
import { WeightChart } from "@/components/weight-chart";
import { requirePatient } from "@/lib/auth";
import { CRISIS_LINE, site } from "@/lib/config";
import { getRepo } from "@/lib/data";
import { PATIENT_STATUS_LABELS } from "@/lib/data/types";
import { programWeek, todayMx } from "@/lib/dates";
import { streak, weightSummary } from "@/lib/progress";
import { teamWaLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Mi seguimiento", robots: { index: false, follow: false } };

function signed(n: number) {
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}`;
}

export default async function PortalPage() {
  const viewer = await requirePatient();
  const repo = getRepo();
  const [patient, checkins] = await Promise.all([repo.myPatient(viewer.userId), repo.myCheckins(viewer.userId)]);
  const wa = teamWaLink("Hola, tengo una duda sobre mi programa.");

  if (!patient) {
    return (
      <>
        <AppHeader home="/portal" />
        <main className="mx-auto w-full max-w-[44rem] px-4 py-12 sm:px-6">
          <h1 className="text-2xl sm:text-3xl">Aún no encontramos tu programa</h1>
          <p className="mt-4 text-lg text-tinta-2">
            Tu acceso se activa después de tu valoración médica. Si ya la tuviste, escríbenos y lo revisamos hoy.
          </p>
          {wa && (
            <a href={wa} target="_blank" rel="noopener" className={`${buttonClass({ size: "lg" })} mt-8`}>
              <WhatsAppIcon />
              Escribir al equipo
            </a>
          )}
        </main>
      </>
    );
  }

  const today = todayMx();
  const started = today >= patient.startDate;
  const week = programWeek(patient.startDate, today);
  const current = checkins.find((c) => c.week === week);
  const firstName = patient.displayName.split(/[\s(]/)[0];
  const active = patient.status === "activo";
  const summary = weightSummary(checkins);
  const previous = weightSummary(checkins.filter((c) => c.week < week));
  const run = streak(checkins, week);
  const points = checkins.filter((c) => c.weightKg !== null).map((c) => ({ week: c.week, weightKg: c.weightKg! }));

  const status = !active
    ? `Tu programa está ${PATIENT_STATUS_LABELS[patient.status].toLowerCase()}.`
    : !started
      ? "Tu programa empieza pronto."
      : week <= 12
        ? `Vas en el lunes ${week} de 12.`
        : `Vas en el lunes ${week}. Terminaste los 12 lunes base y seguimos contigo.`;

  return (
    <>
      <AppHeader home="/portal" />
      <main className="mx-auto grid w-full max-w-[44rem] gap-6 px-4 pt-8 pb-20 sm:px-6 sm:pt-12">
        <div>
          <h1 className="text-[2.25rem] leading-tight sm:text-3xl">Hola, {firstName}</h1>
          <p className="mt-2 text-lg text-tinta-2">{status}</p>
        </div>

        {active && started && <CheckinPanel week={week} current={current} lastWeight={previous?.last ?? null} />}

        <Tile tone="mist" className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <Stat
            label="Peso más reciente"
            value={summary ? summary.last.toFixed(1) : "—"}
            unit={summary ? "kg" : undefined}
            detail={summary ? `Lunes ${summary.lastWeek}` : "Sin registros aún"}
          />
          <Stat
            label="Cambio desde el inicio"
            value={summary?.change != null ? signed(summary.change) : "—"}
            unit={summary?.change != null ? "kg" : undefined}
            detail={summary?.change != null ? `Desde el lunes ${summary.firstWeek}` : "Con dos registros"}
          />
          <Stat
            label="Lunes seguidos"
            value={run}
            detail={run >= 2 ? "Sigue así." : run === 1 ? "Buen comienzo." : "Empieza este lunes."}
            className="col-span-2 sm:col-span-1"
          />
        </Tile>

        <Tile>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg">Tus 12 lunes</h2>
            <p className="text-sm text-piedra">{checkins.filter((c) => c.week <= 12).length} de 12 registrados</p>
          </div>
          <TwelveMondays done={new Set(checkins.map((c) => c.week))} current={active && started ? week : undefined} />
        </Tile>

        <Tile>
          <h2 className="mb-5 text-lg">Tu peso por semana</h2>
          <WeightChart points={points} currentWeek={active ? week : undefined} showChange={false} />
        </Tile>

        <Tile tone="ink" className="grid gap-5">
          <div>
            <h2 className="text-lg">¿Necesitas ayuda?</h2>
            <p className="mt-2 text-tinta-claro">
              Escríbenos por WhatsApp en horario de oficina. Te responde una persona del equipo.
            </p>
          </div>
          {wa && (
            <a href={wa} target="_blank" rel="noopener" className={`${buttonClass({ variant: "inverse" })} justify-self-start`}>
              <WhatsAppIcon />
              Escribir al equipo de {site.brand}
            </a>
          )}
          <ul className="grid gap-2 border-t border-white/15 pt-5 text-sm text-tinta-claro">
            <li className="flex items-center gap-2">
              <Icon name="phone" className="h-4 w-4" />
              Urgencias: 911
            </li>
            <li className="flex items-center gap-2">
              <Icon name="chat" className="h-4 w-4" />
              {CRISIS_LINE.name}, 24 horas: {CRISIS_LINE.phone}
            </li>
          </ul>
        </Tile>
      </main>
    </>
  );
}
