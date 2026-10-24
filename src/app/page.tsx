import { LandingBeacon } from "@/components/attribution";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { WaitlistForm } from "@/components/waitlist-form";
import { WeekTrack } from "@/components/week-track";
import { doctors, excludes, faq, forWho, hero, includes, notForWho, steps } from "@/content/landing";
import { formatMxn, site } from "@/lib/config";

function Check({ className = "text-jade" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`mt-1 h-5 w-5 flex-none ${className}`}>
      <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-5 w-5 flex-none text-piedra">
      <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const price = formatMxn(site.priceMxn);
  const doctorHref = site.whatsappNumber
    ? `https://wa.me/52${site.whatsappNumber}?text=${encodeURIComponent("Hola, soy médico y me interesa el programa para mis pacientes.")}`
    : site.contactEmail
      ? `mailto:${site.contactEmail}?subject=${encodeURIComponent("Médico interesado")}`
      : "#lista";

  return (
    <>
      <LandingBeacon />
      <SiteHeader />
      <main id="contenido">
        {/* Portada */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-6 sm:px-6 md:grid-cols-[1.1fr_1fr] md:items-start md:gap-14 md:pt-12">
          <div className="max-w-xl">
            <h1 className="text-[2.35rem] font-bold leading-[1.1] sm:text-4xl">{hero.title}</h1>
            <p className="mt-5 text-lg text-anil-suave">{hero.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#lista" data-cta className="btn btn-primary">
                {hero.cta}
              </a>
            </div>
            <p className="mt-4 text-piedra">
              Plan fundador: <strong className="text-anil">{price} al mes</strong>, sin incluir el medicamento. Hoy no
              cobramos; abrimos lugares para 30 personas.
            </p>
          </div>
          <WeekTrack />
        </section>

        {/* Cómo funciona */}
        <section className="border-y border-linea bg-blanco">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold">Cómo funciona</h2>
            <ol className="mt-8 grid gap-8 md:grid-cols-4 md:gap-6">
              {steps.map((s, i) => (
                <li key={s.title} className="grid content-start gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hoja font-bold text-jade-oscuro" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="text-anil-suave">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Qué incluye y precio */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Qué incluye el plan fundador</h2>
            <p className="mt-3 text-anil-suave">
              <strong className="text-anil text-xl">{price}</strong> al mes. Puedes dejarlo cuando quieras.
            </p>
            <ul className="mt-6 grid gap-3">
              {includes.map((x) => (
                <li key={x} className="flex gap-3">
                  <Check />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:pt-[4.6rem]">
            <h3 className="text-lg font-bold">No incluye</h3>
            <ul className="mt-4 grid gap-3">
              {excludes.map((x) => (
                <li key={x} className="flex gap-3 text-anil-suave">
                  <Cross />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-hoja p-4">
              No vendemos medicamentos. La valoración y cualquier receta las hace un médico con cédula profesional,
              bajo su responsabilidad.
            </p>
          </div>
        </section>

        {/* Para quién */}
        <section className="bg-anil text-blanco">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Es para ti si</h2>
              <ul className="mt-6 grid gap-3">
                {forWho.map((x) => (
                  <li key={x} className="flex gap-3">
                    <Check className="text-[#8fd6c3]" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Por ahora no es para ti</h2>
              <ul className="mt-6 grid gap-3 text-[#d5dbe8]">
                {notForWho.map((x) => (
                  <li key={x} className="flex gap-3">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-5 w-5 flex-none text-[#aeb8cf]">
                      <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-[#c3cadb]">El cuestionario y el médico confirman si el programa te conviene.</p>
            </div>
          </div>
        </section>

        {/* Lista de espera */}
        <section id="lista" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-16 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold">Únete a la lista de espera</h2>
              <p className="mt-4 text-anil-suave">
                Te escribimos por WhatsApp para contarte cómo sigue. Después contestas el cuestionario y agendas tu
                valoración. Hoy no cobramos nada.
              </p>
            </div>
            <div className="rounded-2xl border border-linea bg-blanco p-5 sm:p-8">
              <WaitlistForm />
            </div>
          </div>
        </section>

        {/* Preguntas */}
        <section className="border-t border-linea bg-blanco">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_2fr]">
            <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
            <div className="grid divide-y divide-linea border-y border-linea">
              {faq.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    {f.q}
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-jade transition-transform group-open:rotate-45">
                      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </summary>
                  <p className="mt-3 max-w-prose text-anil-suave">{f.a.replace("{precio}", price)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Médicos */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 rounded-2xl bg-hoja p-6 sm:p-10 md:grid-cols-[2fr_auto] md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold">{doctors.title}</h2>
              <p className="mt-3 text-anil-suave">{doctors.body}</p>
            </div>
            <a href={doctorHref} className="btn btn-secondary">
              {doctors.cta}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
