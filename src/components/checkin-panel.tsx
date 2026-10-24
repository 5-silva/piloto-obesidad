"use client";

import { useState } from "react";
import { CheckinForm } from "@/components/checkin-form";
import { MOOD_SCALE, SYMPTOM_SCALE } from "@/lib/checkin";
import type { Checkin } from "@/lib/data/types";

/** Check-in de la semana actual: formulario, o resumen con opción de corregir. */
export function CheckinPanel({ week, current }: { week: number; current?: Checkin }) {
  const [editing, setEditing] = useState(!current);
  if (editing) return <CheckinForm week={week} initial={current} onDone={current ? () => setEditing(false) : undefined} />;
  return (
    <div className="rounded-xl bg-hoja p-5">
      <p className="text-lg font-bold">Ya registraste tu semana {week}</p>
      {current && (
        <p className="mt-2 text-anil-suave">
          {current.weightKg !== null && `${current.weightKg.toFixed(1)} kg. `}
          {current.nausea !== null && `Náusea: ${SYMPTOM_SCALE[current.nausea].toLowerCase()}. `}
          {current.mood !== null && `Ánimo: ${MOOD_SCALE[current.mood - 1].toLowerCase()}.`}
        </p>
      )}
      <button type="button" onClick={() => setEditing(true)} className="btn btn-secondary btn-sm mt-4">
        Corregir mi check-in
      </button>
    </div>
  );
}
