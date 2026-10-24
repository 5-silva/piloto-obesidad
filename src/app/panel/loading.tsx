import { Skeleton } from "@/components/ui/surface";

export default function PanelLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="grid gap-5">
      <Skeleton className="h-11 w-64" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-[var(--radius-bloque)]" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Skeleton className="h-96 rounded-[var(--radius-bloque)]" />
        <Skeleton className="h-96 rounded-[var(--radius-bloque)]" />
      </div>
    </div>
  );
}
