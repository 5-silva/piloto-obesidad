import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
        <p role="note" className="rounded-lg bg-aviso-fondo p-3 text-sm text-aviso">
          Borrador en revisión legal. Puede cambiar antes de que el programa reciba pacientes.
        </p>
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="hint mt-2">Última actualización: {updated}</p>
        <div className="prose-legal mt-6">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
