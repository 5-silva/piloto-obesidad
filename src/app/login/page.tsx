import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { demoLogin } from "@/app/actions/auth";
import { LoginForm } from "@/components/login-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getViewer, safeNext } from "@/lib/auth";
import { isDemo } from "@/lib/env";

export const metadata: Metadata = { title: "Entrar", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const viewer = await getViewer();
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "";
  if (viewer.kind === "staff") redirect(safeNext(nextPath.startsWith("/panel") ? nextPath : "", "/panel"));
  if (viewer.kind === "patient") redirect(safeNext(nextPath.startsWith("/portal") ? nextPath : "", "/portal"));

  return (
    <>
      <SiteHeader cta={false} />
      <main className="mx-auto w-full max-w-md px-4 pb-16 pt-8 sm:px-6">
        <h1 className="text-2xl font-bold">Entrar</h1>
        {isDemo() ? (
          <div className="mt-6 grid gap-4">
            <p className="text-anil-suave">En la demo puedes entrar con un clic. Los datos son ficticios.</p>
            <form action={demoLogin} className="grid gap-3">
              <button name="role" value="patient" className="btn btn-primary">
                Entrar como paciente de ejemplo
              </button>
              <button name="role" value="staff" className="btn btn-secondary">
                Entrar al panel del equipo
              </button>
            </form>
          </div>
        ) : (
          <>
            <p className="mt-3 text-anil-suave">Te mandamos un código de 6 dígitos a tu correo. No necesitas contraseña.</p>
            <LoginForm next={nextPath} />
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
