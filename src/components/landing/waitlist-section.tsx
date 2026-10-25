import { WaitlistForm } from "@/components/waitlist-form";
import { Section } from "@/components/ui/layout";
import { Tile } from "@/components/ui/surface";
import { nextSteps } from "@/content/landing";

// En celular el formulario va justo después del título; «Qué sigue» queda debajo.
export function WaitlistSection() {
  return (
    <Section id="lista" labelledBy="lista-titulo">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10">
        <div className="lg:col-start-1 lg:row-start-1 lg:pt-6">
          <h2 id="lista-titulo" className="text-2xl sm:text-3xl">
            Pide tu lugar
          </h2>
          <p className="mt-4 max-w-[30rem] text-lg text-tinta-2">
            Abrimos 30 lugares para pacientes fundadores. Pedirlo toma un minuto y no te compromete a nada.
          </p>
        </div>
        <Tile className="sm:p-9 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <WaitlistForm />
        </Tile>
        <div className="lg:col-start-1 lg:row-start-2">
          <h3 className="text-base">Qué sigue</h3>
          <ol className="mt-4 grid gap-4">
            {nextSteps.map((s, i) => (
              <li key={s} className="flex items-start gap-4">
                <span
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-niebla text-sm font-semibold"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="pt-1 text-tinta-2">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
