import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Wordmark } from "@/components/site-chrome";
import { Icon } from "@/components/ui/icon";

/** Encabezado de las áreas con sesión (portal y panel en celular). */
export function AppHeader({ home, width = "max-w-[44rem]" }: { home: string; width?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-linea/80 bg-blanco/85 backdrop-blur-md">
      <div className={`mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 ${width}`}>
        <Link href={home} className="rounded-md text-tinta no-underline" aria-label="Inicio de tu cuenta">
          <Wordmark />
        </Link>
        <form action={logout}>
          <button className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-tinta-2 hover:text-tinta">
            <Icon name="logout" className="h-4 w-4" />
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
