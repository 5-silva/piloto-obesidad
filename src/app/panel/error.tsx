"use client";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/surface";

export default function PanelError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid max-w-[36rem] gap-5">
      <Notice tone="alerta" title="No pudimos cargar esta vista">
        Puede ser la conexión con la base de datos. Los datos guardados no se perdieron.
      </Notice>
      <Button onClick={reset} className="justify-self-start">
        Intentar de nuevo
      </Button>
    </div>
  );
}
