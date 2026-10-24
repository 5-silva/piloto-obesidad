import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { PanelNav } from "@/components/panel/nav";
import { Wordmark } from "@/components/site-chrome";
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
    <div className="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b border-linea bg-blanco px-3 py-3 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:px-4 md:py-6">
        <div className="mb-3 flex items-center justify-between gap-2 px-2 md:mb-8">
          <Link href="/panel" aria-label="Resumen del panel">
            <Wordmark />
          </Link>
          <form action={logout} className="md:hidden">
            <button className="text-sm underline">Salir</button>
          </form>
        </div>
        <PanelNav counts={{ "/panel/hoy": pending }} />
        <div className="mt-8 hidden px-2 text-sm text-piedra md:block">
          <p className="font-bold text-anil">{staff.name}</p>
          <form action={logout}>
            <button className="mt-1 underline">Salir</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
