import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader cta={false} />
      <main className="mx-auto w-full max-w-[40rem] px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-sm font-semibold text-piedra">Error 404</p>
        <h1 className="mt-3 text-[2.25rem] leading-tight sm:text-3xl">No encontramos esta página</h1>
        <p className="mt-4 text-lg text-tinta-2">
          Si llegaste desde la liga de tu cuestionario, puede que esté incompleta. Cópiala completa desde tu correo o escríbenos
          por WhatsApp.
        </p>
        <ButtonLink href="/" size="lg" className="mt-8">
          Ir al inicio
        </ButtonLink>
      </main>
      <SiteFooter />
    </>
  );
}
