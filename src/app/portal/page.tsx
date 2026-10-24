import type { Metadata } from "next";
import { logout } from "@/app/actions/auth";
import { CheckinPanel } from "@/components/checkin-panel";
import { ProgressStrip } from "@/components/progress-strip";
import { Wordmark } from "@/components/site-chrome";
import { WeightChart } from "@/components/weight-chart";
import { requirePatient } from "@/lib/auth";
import { CRISIS_LINE, site } from "@/lib/config";
import { getRepo } from "@/lib/data";
import { PATIENT_STATUS_LABELS } from "@/lib/data/types";
import { programWeek, todayMx } from "@/lib/dates";
import { teamWaLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Mi seguimiento", robots: { index: false, follow: false } };

export default async function PortalPage() {
  const viewer = await requirePatient();
  const repo = getRepo();
  const [patient, checkins] = await Promise.all([repo.myPatient(viewer.userId), repo.myCheckins(viewer.userId)]);
  const wa = teamWaLink("Hola, tengo una duda sobre mi programa.");

  const header = (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <Wordmark />
      <form action={logout}>
        <button className="text-sm underline">Salir</button>
      </form>
    </header>
  );

  if (!patient) {
    return (
      <>
        {header}
        <main className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
          <h1 className="text-2xl font-bold">No encontramos tu programa</h1>
          <p className="mt-3 text-anil-suave">
            Tu acceso se activa después de tu valoración médica. Si ya la tuviste, escríbenos y lo revisamos.
          </p>
          {wa && (
            <a href={wa} className="btn btn-primary mt-6" target="_blank" rel="noopener">
              Escribir al equipo
            </a>
          )}
        </main>
      </>
    );
  }

  const today = todayMx();
  const week = programWeek(patient.startDate, today);
  const current = checkins.find((c) => c.week === week);
  const firstName = patient.displayName.split(/[\s(]/)[0];
  const points = checkins.filter((c) => c.weightKg !== null).map((c) => ({ week: c.week, weightKg: c.weightKg! }));
  const active = patient.status === "activo";
  const started = today >= patient.startDate;

  return (
    <>
      {header}
      <main className="mx-auto grid w-full max-w-3xl gap-6 px-4 pb-16 sm:px-6">
        <section>
          <h1 className="text-2xl font-bold sm:text-3xl">Hola, {firstName}</h1>
          <p className="mt-1 text-anil-suave">
            {!active
              ? `Tu programa está: ${PATIENT_STATUS_LABELS[patient.status].toLowerCase()}.`
              : !started
                ? "Tu programa empieza pronto."
                : week <= 12
                  ? `Vas en la semana ${week} de 12.`
                  : `Vas en la semana ${week}. Terminaste las 12 semanas base; seguimos contigo.`}
          </p>
          <div className="mt-5 rounded-2xl border border-linea bg-blanco p-4 sm:p-5">
            <ProgressStrip done={new Set(checkins.map((c) => c.week))} current={started ? week : 0} />
            <p className="mt-3 text-sm text-piedra">Verde: semana registrada. El contorno marca la semana actual.</p>
          </div>
        </section>

        {active && started && (
          <section className="rounded-2xl border border-linea bg-blanco p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-bold">Check-in de la semana {week}</h2>
            <CheckinPanel week={week} current={current} />
          </section>
        )}

        <section className="rounded-2xl border border-linea bg-blanco p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-bold">Tu peso por semana</h2>
          <WeightChart points={points} currentWeek={active ? week : undefined} />
        </section>

        <section className="grid gap-3 rounded-2xl bg-anil p-5 text-blanco sm:p-6">
          <h2 className="text-lg font-bold">¿Necesitas ayuda?</h2>
          <p className="text-[#d5dbe8]">
            Escríbenos por WhatsApp en horario de oficina. En una urgencia llama al 911. Si te sientes muy mal emocionalmente, la{" "}
            {CRISIS_LINE.name} atiende las 24 horas en el {CRISIS_LINE.phone}.
          </p>
          {wa && (
            <a href={wa} className="btn justify-self-start bg-blanco text-anil hover:bg-hoja" target="_blank" rel="noopener">
              Escribir al equipo de {site.brand}
            </a>
          )}
        </section>
      </main>
    </>
  );
}
