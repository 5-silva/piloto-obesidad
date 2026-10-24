import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ScreeningForm } from "@/components/screening-form";
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
      <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-4 sm:px-6">
        {open ? (
          <>
            <h1 className="text-2xl font-bold sm:text-3xl">{firstName}, cuéntanos un poco de tu salud</h1>
            <p className="mt-3 text-anil-suave">
              Son 5 minutos. El médico usa tus respuestas para saber si el programa es seguro para ti y qué revisar
              en tu valoración. No es un diagnóstico.
            </p>
            <ScreeningForm token={token} defaultGlp1={lead.glp1} />
          </>
        ) : (
          <div className="rounded-2xl bg-hoja p-6 sm:p-8">
            <h1 className="text-xl font-bold">Ya recibimos tu cuestionario</h1>
            <p className="mt-3">
              Gracias, {firstName}. El equipo ya tiene tus respuestas y te escribirá por WhatsApp con el siguiente paso.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
