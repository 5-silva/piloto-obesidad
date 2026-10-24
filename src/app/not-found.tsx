import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <>
      <SiteHeader cta={false} />
      <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold">No encontramos esta página</h1>
        <p className="mt-3 text-anil-suave">
          Si llegaste desde una liga de cuestionario, puede que esté incompleta. Cópiala completa desde tu correo o escríbenos por
          WhatsApp.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Ir al inicio
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
