import Link from "next/link";
import { CRISIS_LINE, site } from "@/lib/config";

export function Wordmark({ className = "" }: { className?: string }) {
  // Doce puntos en fila: una semana cada uno.
  return (
    <span className={`inline-flex items-center gap-2.5 font-bold text-lg tracking-tight ${className}`}>
      <svg aria-hidden="true" width="30" height="12" viewBox="0 0 30 12" className="text-jade">
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <circle cx={2.5 + i * 5} cy={2.5} r={2} fill="currentColor" />
            <circle cx={2.5 + i * 5} cy={9.5} r={2} fill="currentColor" opacity={i === 5 ? 1 : 0.45} />
          </g>
        ))}
      </svg>
      {site.brand}
    </span>
  );
}

export function SiteHeader({ cta = true }: { cta?: boolean }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <Link href="/" className="no-underline" aria-label={`${site.brand}, inicio`}>
        <Wordmark />
      </Link>
      {cta && (
        <Link href="/#lista" data-cta className="btn btn-secondary btn-sm">
          Unirme a la lista
        </Link>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-linea">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-piedra sm:px-6 md:grid-cols-[1fr_auto]">
        <div className="grid gap-2 max-w-prose">
          <Wordmark className="text-anil text-base" />
          <p>
            Este sitio no sustituye la consulta médica. En una urgencia llama al 911. Si estás pasando por un momento
            difícil, la {CRISIS_LINE.name} atiende las 24 horas en el {CRISIS_LINE.phone}.
          </p>
        </div>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 md:flex-col md:items-end">
          <Link href="/aviso-de-privacidad">Aviso de privacidad</Link>
          <Link href="/terminos">Términos del programa</Link>
          {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>}
          <Link href="/login">Acceso de pacientes</Link>
        </nav>
      </div>
    </footer>
  );
}
