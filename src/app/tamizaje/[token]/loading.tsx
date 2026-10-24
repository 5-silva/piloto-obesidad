import { Skeleton } from "@/components/ui/surface";

export default function ScreeningLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Cargando el cuestionario"
      className="mx-auto grid w-full max-w-[40rem] gap-5 px-4 pt-24 pb-20 sm:px-6"
    >
      <Skeleton className="h-11 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="mt-6 h-2 w-full" />
      <Skeleton className="h-72 w-full rounded-[var(--radius-bloque)]" />
    </main>
  );
}
