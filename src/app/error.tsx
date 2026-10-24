"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Algo falló de nuestro lado</h1>
      <p className="mt-3 text-anil-suave">Tus datos guardados no se perdieron. Intenta de nuevo; si sigue pasando, escríbenos por WhatsApp.</p>
      <button onClick={reset} className="btn btn-primary mt-6">
        Intentar de nuevo
      </button>
    </main>
  );
}
