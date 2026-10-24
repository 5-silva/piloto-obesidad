import type { ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-[70rem] px-4 sm:px-6 ${className}`}>{children}</div>;
}

type Tone = "white" | "mist";

/** Sección de página con ritmo vertical consistente. */
export function Section({
  id,
  tone = "white",
  className = "",
  children,
  labelledBy,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${tone === "mist" ? "bg-niebla" : "bg-blanco"} py-16 sm:py-24 ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Encabezado de sección: título y entrada opcional, alineados a la izquierda. */
export function SectionHeading({
  id,
  title,
  lead,
  className = "",
}: {
  id: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[40rem] ${className}`}>
      <h2 id={id} className="text-2xl sm:text-3xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg text-tinta-2">{lead}</p>}
    </div>
  );
}
