import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeading } from "@/components/ui/layout";
import { Tile } from "@/components/ui/surface";
import { doctors, evidence, excludes, faq, forWho, includes, milestones, notForWho, privacy, steps } from "@/content/landing";
import { formatMxn, site } from "@/lib/config";

export function Evidence() {
  return (
    <Section tone="mist" labelledBy="evidencia">
      <h2 id="evidencia" className="sr-only">
        Por qué acompañar el tratamiento
      </h2>
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        {evidence.stats.map((s) => (
          <div key={s.value} className="grid content-start gap-3">
            <p className="text-[3.5rem] leading-none font-medium tracking-[-0.04em] sm:text-[4.5rem]">{s.value}</p>
            <p className="max-w-[26rem] text-lg text-tinta-2">
              {s.label}
              <a
                href={`#fuente-${s.source}`}
                className="ml-0.5 align-super text-xs font-semibold text-piedra no-underline hover:text-tinta"
                aria-label={`Fuente ${s.source}`}
              >
                {s.source}
              </a>
            </p>
          </div>
        ))}
      </div>
      <p className="mt-12 max-w-[40rem] border-t border-linea-2 pt-8 text-xl font-medium tracking-[-0.025em] sm:text-2xl">
        {evidence.close.replace("{marca}", site.brand)}
      </p>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section id="como-funciona" labelledBy="como-funciona-titulo">
      <SectionHeading
        id="como-funciona-titulo"
        title="Cómo funciona"
        lead="Todo en línea, desde tu celular. Sin salas de espera."
      />
      <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="grid content-start gap-3 border-t-2 border-tinta pt-5">
            <span className="text-sm font-semibold text-piedra">Paso {i + 1}</span>
            <h3 className="text-lg">{s.title}</h3>
            <p className="text-tinta-2">{s.body}</p>
          </li>
        ))}
      </ol>

      <Tile tone="mist" className="mt-14">
        <h3 className="text-lg">Lo que pasa en tus 12 lunes</h3>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {milestones.map((m) => (
            <li key={m.week} className="grid content-start gap-1.5">
              <span className="inline-flex w-fit items-center rounded-full bg-blanco px-2.5 py-1 text-xs font-semibold text-jade-oscuro ring-1 ring-linea">
                Lunes {m.week}
              </span>
              <span className="mt-1 font-semibold">{m.title}</span>
              <span className="text-sm text-tinta-2">{m.body}</span>
            </li>
          ))}
        </ol>
      </Tile>
    </Section>
  );
}

export function Plan() {
  const price = formatMxn(site.priceMxn);
  return (
    <Section id="plan" tone="mist" labelledBy="plan-titulo">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Tile className="ring-0! sm:p-10">
          <p className="font-semibold text-piedra">Plan fundador</p>
          <h2 id="plan-titulo" className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[3.5rem] leading-none font-medium tracking-[-0.04em] tabular-nums">{price}</span>
            <span className="text-lg font-normal tracking-normal text-tinta-2">al mes</span>
          </h2>
          <p className="mt-4 text-tinta-2">Sin permanencia: lo dejas cuando quieras. Hoy no cobramos: solo pides tu lugar.</p>
          <ul className="mt-8 grid gap-4 border-t border-linea pt-8">
            {includes.map((x) => (
              <li key={x.lead} className="flex gap-3">
                <Icon name="check" className="mt-1 h-5 w-5 text-jade" strokeWidth={2.4} />
                <p>
                  <strong className="font-semibold">{x.lead}</strong> <span className="text-tinta-2">{x.body}</span>
                </p>
              </li>
            ))}
          </ul>
          <ButtonLink href="#lista" size="lg" className="mt-10" full data-cta>
            Pedir mi lugar
          </ButtonLink>
        </Tile>

        <div className="grid content-start gap-6">
          <Tile className="ring-0!">
            <h3 className="text-lg">No incluye</h3>
            <ul className="mt-4 grid gap-3">
              {excludes.map((x) => (
                <li key={x} className="flex gap-3 text-tinta-2">
                  <Icon name="x" className="mt-1 h-5 w-5 text-piedra" />
                  {x}
                </li>
              ))}
            </ul>
          </Tile>
          <Tile tone="ink">
            <Icon name="stethoscope" className="h-6 w-6 text-tinta-claro" />
            <p className="mt-4 text-lg font-semibold">No vendemos medicamentos.</p>
            <p className="mt-2 text-tinta-claro">
              La valoración y cualquier receta las hace un médico con cédula profesional, bajo su responsabilidad. Tú compras el
              medicamento donde prefieras.
            </p>
          </Tile>
        </div>
      </div>
    </Section>
  );
}

export function Audience() {
  return (
    <Section labelledBy="para-quien">
      <SectionHeading
        id="para-quien"
        title="¿Es para ti?"
        lead="Esta es la regla general. El cuestionario y el médico lo confirman."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Tile tone="jade">
          <h3 className="text-lg">Es para ti si</h3>
          <ul className="mt-5 grid gap-4">
            {forWho.map((x) => (
              <li key={x} className="flex gap-3">
                <Icon name="check" className="mt-1 h-5 w-5 text-jade" strokeWidth={2.4} />
                {x}
              </li>
            ))}
          </ul>
        </Tile>
        <Tile tone="mist">
          <h3 className="text-lg">Por ahora no es para ti</h3>
          <ul className="mt-5 grid gap-4 text-tinta-2">
            {notForWho.map((x) => (
              <li key={x} className="flex gap-3">
                <Icon name="x" className="mt-1 h-5 w-5 text-piedra" />
                {x}
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </Section>
  );
}

export function Privacy() {
  return (
    <Section tone="mist" labelledBy="privacidad">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <Icon name="shield" className="h-8 w-8 text-jade" strokeWidth={1.8} />
          <h2 id="privacidad" className="mt-5 text-2xl sm:text-3xl">
            {privacy.title}
          </h2>
          <p className="mt-4 text-lg text-tinta-2">{privacy.lead}</p>
          <Link
            href="/aviso-de-privacidad"
            className="mt-6 inline-block font-semibold underline decoration-linea-2 underline-offset-4 hover:decoration-tinta"
          >
            Leer el aviso de privacidad
          </Link>
        </div>
        <ul className="grid gap-8 sm:grid-cols-3 lg:gap-6">
          {privacy.points.map((p) => (
            <li key={p.title} className="grid content-start gap-2">
              <Icon name={p.icon} className="h-6 w-6 text-tinta" strokeWidth={1.8} />
              <h3 className="mt-2 text-base">{p.title}</h3>
              <p className="text-sm text-tinta-2">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function Faq() {
  const price = formatMxn(site.priceMxn);
  return (
    <Section id="preguntas" labelledBy="preguntas-titulo">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading id="preguntas-titulo" title="Preguntas frecuentes" />
        <div className="divide-y divide-linea border-y border-linea">
          {faq.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-niebla transition-transform duration-200 group-open:rotate-45">
                  <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} />
                </span>
              </summary>
              <p className="max-w-[40rem] pr-12 pb-6 text-tinta-2">{f.a.replace("{precio}", price)}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Doctors() {
  const href = site.whatsappNumber
    ? `https://wa.me/52${site.whatsappNumber}?text=${encodeURIComponent("Hola, soy médico y me interesa el programa para mis pacientes.")}`
    : site.contactEmail
      ? `mailto:${site.contactEmail}?subject=${encodeURIComponent("Médico interesado")}`
      : "#lista";
  return (
    <Section className="pt-0! sm:pt-0!" labelledBy="medicos">
      <Tile tone="ink" className="grid gap-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
        <div className="max-w-[40rem]">
          <h2 id="medicos" className="text-xl sm:text-2xl">
            {doctors.title}
          </h2>
          <p className="mt-3 text-tinta-claro">{doctors.body}</p>
        </div>
        <ButtonLink href={href} variant="inverse">
          {doctors.cta}
        </ButtonLink>
      </Tile>
    </Section>
  );
}
