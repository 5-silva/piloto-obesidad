"use client";

import { useState } from "react";
import { CheckinForm } from "@/components/checkin-form";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tile } from "@/components/ui/surface";
import { MOOD_SCALE, SYMPTOM_SCALE } from "@/lib/checkin";
import type { Checkin } from "@/lib/data/types";

/** La tarjeta «Este lunes»: invita al check-in, lo muestra paso a paso o resume lo registrado. */
export function CheckinPanel({ week, current, lastWeight }: { week: number; current?: Checkin; lastWeight?: number | null }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <Tile className="paso-entra sm:p-9">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-rosa">
            <span className="h-2 w-2 rounded-full bg-rosa" aria-hidden="true" />
            Check-in del lunes {week}
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-tinta-2 underline decoration-linea-2 underline-offset-4 hover:text-tinta"
          >
            Cancelar
          </button>
        </div>
        <CheckinForm week={week} initial={current} lastWeight={lastWeight} onClose={() => setOpen(false)} />
      </Tile>
    );
  }

  if (current) {
    const parts = [
      current.weightKg !== null ? `${current.weightKg.toFixed(1)} kg` : null,
      current.nausea !== null ? `náusea: ${SYMPTOM_SCALE[current.nausea].toLowerCase()}` : null,
      current.mood !== null ? `ánimo: ${MOOD_SCALE[current.mood - 1].toLowerCase()}` : null,
    ].filter(Boolean);
    return (
      <Tile tone="jade" className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jade text-blanco">
          <Icon name="check" className="h-6 w-6" strokeWidth={2.6} />
        </span>
        <div>
          <h2 className="text-lg">Ya registraste tu lunes {week}</h2>
          <p className="text-tinta-2 first-letter:uppercase">{parts.join(", ")}.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="justify-self-start">
          Corregir
        </Button>
      </Tile>
    );
  }

  return (
    <Tile tone="ink" className="grid gap-6 sm:p-9">
      <div>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-claro">
          <span className="h-2 w-2 rounded-full bg-rosa" aria-hidden="true" />
          Este lunes
        </p>
        <h2 className="mt-3 text-2xl sm:text-3xl">Registra tu lunes {week}</h2>
        <p className="mt-3 max-w-[30rem] text-tinta-claro">
          Dos minutos: tu peso, cómo te has sentido y si algo te preocupa. El equipo lo revisa hoy.
        </p>
      </div>
      <Button variant="inverse" size="lg" onClick={() => setOpen(true)} className="justify-self-start">
        Empezar mi check-in
      </Button>
    </Tile>
  );
}
