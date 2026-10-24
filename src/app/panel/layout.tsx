import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { PanelNav } from "@/components/panel/nav";
import { Wordmark } from "@/components/site-chrome";
import { Icon } from "@/components/ui/icon";
import { requireStaff } from "@/lib/auth";
import { getSnapshot } from "@/lib/data/snapshot";
import { todayMx } from "@/lib/dates";
import { todayTasks } from "@/lib/metrics";

export const metadata: Metadata = { title: "Panel", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: LayoutProps<"/panel">) {
  const staff = await requireStaff();
  const tasks = todayTasks(await getSnapshot(), todayMx());
  const pending = tasks.flagged.length + tasks.newLeads.length + tasks.toSchedule.length + tasks.missingCheckin.length;

  return (
    <div className="min-h-screen bg-niebla md:grid md:grid-cols-[15.5rem_1fr]">
      <aside className="sticky top-0 z-30 border-b border-linea bg-blanco px-3 pt-3 pb-2 md:h-screen md:border-r md:border-b-0 md:px-4 md:py-6">
        <div className="mb-3 flex items-center justify-between gap-2 px-1 md:mb-10 md:px-3">
          <Link href="/panel" aria-label="Resumen del panel" className="rounded-md text-tinta no-underline">
            <Wordmark />
          </Link>
          <form action={logout} className="md:hidden">
            <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-tinta-2">
              <Icon name="logout" className="h-4 w-4" />
              Salir
            </button>
          </form>
        </div>
        <PanelNav counts={{ "/panel/hoy": pending }} />
        <div className="absolute right-4 bottom-6 left-4 hidden border-t border-linea px-3 pt-4 text-sm md:block">
          <p className="font-semibold">{staff.name}</p>
          <form action={logout}>
            <button className="mt-1 inline-flex items-center gap-1.5 text-tinta-2 hover:text-tinta">
              <Icon name="logout" className="h-4 w-4" />
              Salir
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-[72rem]">{children}</div>
      </main>
    </div>
  );
}
