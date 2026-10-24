"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-[40rem] px-4 py-20 sm:px-6 sm:py-28">
      <h1 className="text-[2.25rem] leading-tight sm:text-3xl">Algo falló de nuestro lado</h1>
      <p className="mt-4 text-lg text-tinta-2">
        Lo que ya guardaste no se perdió. Intenta de nuevo; si sigue pasando, escríbenos por WhatsApp.
      </p>
      <Button size="lg" onClick={reset} className="mt-8">
        Intentar de nuevo
      </Button>
    </main>
  );
}
