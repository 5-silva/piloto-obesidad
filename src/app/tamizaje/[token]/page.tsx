import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScreeningForm } from "@/components/screening-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Icon } from "@/components/ui/icon";
import { Tile } from "@/components/ui/surface";
import { getRepo } from "@/lib/data";
import { tokenSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Cuestionario", robots: { index: false, follow: false } };

const OPEN_STATUSES = new Set(["nuevo", "contactado", "tamizaje_enviado"]);

export default async function ScreeningPage({ params }: PageProps<"/tamizaje/[token]">) {
  const { token } = await params;
  if (!tokenSchema.safeParse(token).success) notFound();
  const lead = await getRepo().getLeadByToken(token);
  if (!lead) notFound();
  const firstName = lead.name.split(/\s+/)[0];
  const open = OPEN_STATUSES.has(lead.status);

  return (
    <>
      <SiteHeader cta={false} />
      <main className="mx-auto w-full max-w-[40rem] px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
        {open ? (
          <>
            <h1 className="text-[2.25rem] leading-tight sm:text-3xl">{firstName}, cuéntanos de tu salud</h1>
            <p className="mt-4 text-lg text-tinta-2">
              Cinco pasos, unos cinco minutos. El médico usa tus respuestas para saber si el programa es seguro para ti. No es un
              diagnóstico.
            </p>
            <ScreeningForm token={token} defaultGlp1={lead.glp1} />
          </>
        ) : (
          <Tile tone="jade" className="grid justify-items-start gap-4 sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jade text-blanco">
              <Icon name="check" className="h-6 w-6" strokeWidth={2.6} />
            </span>
            <h1 className="text-2xl">Ya recibimos tu cuestionario</h1>
            <p className="text-tinta-2">
              Gracias, {firstName}. El equipo ya tiene tus respuestas y te escribirá por WhatsApp con el siguiente paso.
            </p>
          </Tile>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
