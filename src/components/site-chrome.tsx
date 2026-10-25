import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { CRISIS_LINE, site } from "@/lib/config";

/** Marca: doce puntos en tres filas de cuatro (los tres meses del plan); el primero es «este lunes». */
export function Mark({ className = "h-[18px] w-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 18" className={`flex-none ${className}`}>
      {Array.from({ length: 12 }, (_, i) => (
        <circle
          key={i}
          cx={3 + (i % 4) * 6}
          cy={3 + Math.floor(i / 4) * 6}
          r={2.3}
          fill={i === 0 ? "var(--color-rosa)" : "currentColor"}
        />
      ))}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-xl font-semibold tracking-[-0.03em] ${className}`}>
      <Mark />
      {site.brand}
    </span>
  );
}

const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#plan", label: "Precio" },
  { href: "/#preguntas", label: "Preguntas" },
];

export function SiteHeader({ nav = false, cta = true }: { nav?: boolean; cta?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-linea/80 bg-blanco/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[70rem] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="rounded-md text-tinta no-underline" aria-label={`${site.brand}, inicio`}>
          <Wordmark />
        </Link>
        {nav && (
          <nav aria-label="Secciones" className="hidden items-center gap-8 text-sm font-medium text-tinta-2 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-tinta">
                {n.label}
              </Link>
            ))}
          </nav>
        )}
        {cta && (
          <ButtonLink href="/#lista" size="sm" data-cta>
            Pedir mi lugar
          </ButtonLink>
        )}
      </div>
    </header>
  );
}

export const SOURCES = [
  {
    id: 1,
    text: "Instituto Nacional de Salud Pública. Encuesta Nacional de Salud y Nutrición Continua 2020–2023. Adultos de 20 años o más.",
    href: "https://ensanut.insp.mx/",
  },
  {
    id: 2,
    text: "Thomsen RW y cols. Estudio nacional en Dinamarca con 77,310 adultos sin diabetes que iniciaron un medicamento para bajar de peso entre 2022 y 2023. Congreso EASD, 2025.",
    href: "https://www.news-medical.net/news/20250915/StudyHalf-of-adults-without-diabetes-taking-weight-loss-drug-discontinue-treatment-within-a-year.aspx",
  },
];

export function SiteFooter({ sources = false }: { sources?: boolean }) {
  return (
    <footer className="mt-auto bg-niebla">
      <div className="mx-auto grid w-full max-w-[70rem] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid content-start gap-4">
          <Wordmark />
          <p className="max-w-[34rem] text-sm text-tinta-2">
            {site.brand} es un programa piloto de acompañamiento. No sustituye la consulta médica ni vende medicamentos. En una
            urgencia llama al 911. Si estás pasando por un momento muy difícil, la {CRISIS_LINE.name} atiende las 24 horas en el{" "}
            {CRISIS_LINE.phone}.
          </p>
        </div>
        <nav aria-label="Legal y acceso" className="grid content-start gap-3 text-sm sm:grid-cols-2">
          <Link href="/aviso-de-privacidad" className="text-tinta-2 hover:text-tinta">
            Aviso de privacidad
          </Link>
          <Link href="/terminos" className="text-tinta-2 hover:text-tinta">
            Términos del programa
          </Link>
          <Link href="/login" className="text-tinta-2 hover:text-tinta">
            Acceso de pacientes
          </Link>
          {site.contactEmail && (
            <a href={`mailto:${site.contactEmail}`} className="text-tinta-2 hover:text-tinta">
              {site.contactEmail}
            </a>
          )}
        </nav>
        {sources && (
          <div className="border-t border-linea-2 pt-6 lg:col-span-2">
            <h2 className="text-sm font-semibold">Fuentes</h2>
            <ol className="mt-2 grid gap-1.5 text-xs text-piedra">
              {SOURCES.map((s) => (
                <li key={s.id} id={`fuente-${s.id}`}>
                  {s.id}. {s.text}{" "}
                  <a href={s.href} target="_blank" rel="noopener" className="underline">
                    Ver fuente
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </footer>
  );
}
