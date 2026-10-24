import { Skeleton } from "@/components/ui/surface";

export default function PortalLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Cargando tu seguimiento"
      className="mx-auto grid w-full max-w-[44rem] gap-6 px-4 pt-24 pb-20 sm:px-6"
    >
      <Skeleton className="h-11 w-48" />
      <Skeleton className="h-6 w-56" />
      <Skeleton className="h-64 rounded-[var(--radius-bloque)]" />
      <Skeleton className="h-40 rounded-[var(--radius-bloque)]" />
      <Skeleton className="h-56 rounded-[var(--radius-bloque)]" />
    </main>
  );
}
