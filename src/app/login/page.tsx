import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { demoLogin } from "@/app/actions/auth";
import { LoginForm } from "@/components/login-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tile } from "@/components/ui/surface";
import { getViewer, safeNext } from "@/lib/auth";
import { isDemo } from "@/lib/env";

export const metadata: Metadata = { title: "Entrar", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const viewer = await getViewer();
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "";
  if (viewer.kind === "staff") redirect(safeNext(nextPath.startsWith("/panel") ? nextPath : "", "/panel"));
  if (viewer.kind === "patient") redirect(safeNext(nextPath.startsWith("/portal") ? nextPath : "", "/portal"));
  const demo = isDemo();

  return (
    <>
      <SiteHeader cta={false} />
      <main className="mx-auto w-full max-w-[28rem] px-4 pt-12 pb-20 sm:pt-20">
        <h1 className="text-[2.25rem] leading-tight sm:text-3xl">Entra a tu seguimiento</h1>
        <p className="mt-3 text-lg text-tinta-2">Sin contraseñas: te mandamos un código a tu correo.</p>
        <Tile className="mt-8 sm:p-8">
          <LoginForm next={nextPath} demo={demo} />
        </Tile>
        {demo && (
          <div className="mt-8 grid gap-3">
            <p className="text-center text-sm text-piedra">O entra directo a la demo</p>
            <form action={demoLogin} className="grid gap-2.5 sm:grid-cols-2">
              <Button name="role" value="patient" variant="secondary" full>
                Paciente de ejemplo
              </Button>
              <Button name="role" value="staff" variant="secondary" full>
                Panel del equipo
              </Button>
            </form>
          </div>
        )}
        <p className="mt-10 flex items-start gap-2 text-sm text-piedra">
          <Icon name="lock" className="mt-0.5 h-4 w-4" />
          Tu acceso se activa después de tu valoración médica. Solo tú y tu equipo ven tu seguimiento.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
