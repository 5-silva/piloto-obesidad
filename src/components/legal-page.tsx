import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Notice } from "@/components/ui/surface";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[42rem] px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
        <Notice tone="aviso" title="Borrador en revisión legal">
          Puede cambiar antes de que el programa reciba pacientes.
        </Notice>
        <h1 className="mt-10 text-[2.25rem] leading-tight sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm text-piedra">Última actualización: {updated}</p>
        <div className="prose-legal mt-8">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
