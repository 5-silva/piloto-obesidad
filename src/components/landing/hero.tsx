import { TwelveMondays } from "@/components/twelve-mondays";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/layout";
import { hero } from "@/content/landing";
import { formatMxn, site } from "@/lib/config";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
      <Container className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-niebla px-3 py-1.5 text-sm font-semibold text-tinta-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rosa" aria-hidden="true" />
            {hero.kicker}
          </p>
          <h1 id="hero-title" className="mt-6 text-[2.5rem] leading-[1.04] sm:text-4xl lg:text-[3.6rem]">
            {hero.title.split(". ").map((part, i, all) => (
              <span key={part} className="block">
                {part}
                {i < all.length - 1 ? "." : ""}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[36rem] text-lg text-tinta-2">{hero.lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href="#lista" size="lg" data-cta>
              {hero.cta}
            </ButtonLink>
            <ButtonLink href="#como-funciona" variant="quiet">
              {hero.secondary}
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-piedra">
            {formatMxn(site.priceMxn)} al mes cuando empiece tu plan. El medicamento no está incluido.
          </p>
          <ul className="mt-10 grid gap-3 border-t border-linea pt-6 sm:grid-cols-3 sm:gap-4">
            {hero.trust.map((t) => (
              <li key={t.text} className="flex items-center gap-2.5 text-sm font-medium text-tinta-2">
                <Icon name={t.icon} className="h-5 w-5 text-jade" />
                {t.text}
              </li>
            ))}
          </ul>
        </div>

        <figure className="w-full max-w-[34rem] rounded-[2rem] bg-niebla p-5 sm:p-7 lg:max-w-none">
          <figcaption className="mb-5 flex items-end justify-between gap-4">
            <span>
              <span className="block text-lg font-semibold">Tus 12 lunes</span>
              <span className="text-sm text-piedra">Un check-in cada lunes. Alguien lo revisa siempre.</span>
            </span>
          </figcaption>
          <TwelveMondays animate />
        </figure>
      </Container>
    </section>
  );
}
