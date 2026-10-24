"use client";

import { useActionState } from "react";
import { saveCost, type CostState } from "@/app/actions/panel";

export function CostForm({ month }: { month: string }) {
  const [state, action, pending] = useActionState<CostState, FormData>(saveCost, { status: "idle" });
  const errors = state.status === "error" ? state.errors : {};
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[9rem_1fr_9rem_7rem_1.5fr_auto] lg:items-end">
      <div className="field">
        <label htmlFor="month" className="label">
          Mes
        </label>
        <input id="month" name="month" type="month" defaultValue={month} className="input" />
      </div>
      <div className="field">
        <label htmlFor="channel" className="label">
          Canal
        </label>
        <input id="channel" name="channel" list="channels" placeholder="instagram" className="input" aria-invalid={!!errors.channel} />
        <datalist id="channels">
          {["instagram", "facebook", "google", "tiktok", "medico", "directo"].map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div className="field">
        <label htmlFor="amount_mxn" className="label">
          Gasto (MXN)
        </label>
        <input id="amount_mxn" name="amount_mxn" inputMode="decimal" className="input" aria-invalid={!!errors.amountMxn} />
      </div>
      <div className="field">
        <label htmlFor="hours" className="label">
          Horas
        </label>
        <input id="hours" name="hours" inputMode="decimal" className="input" />
      </div>
      <div className="field">
        <label htmlFor="note" className="label">
          Nota
        </label>
        <input id="note" name="note" className="input" />
      </div>
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Guardando…" : "Guardar"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="error sm:col-span-2 lg:col-span-6">
          {Object.values(errors).join(". ")}
        </p>
      )}
      {state.status === "ok" && (
        <p role="status" className="text-jade-oscuro font-bold sm:col-span-2 lg:col-span-6">
          Guardado. Si el canal y el mes ya existían, se reemplazó el registro.
        </p>
      )}
    </form>
  );
}
