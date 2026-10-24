"use client";

import { useActionState } from "react";
import { saveCost, type CostState } from "@/app/actions/panel";
import { Button } from "@/components/ui/button";
import { describe, Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/surface";

export function CostForm({ month }: { month: string }) {
  const [state, action, pending] = useActionState<CostState, FormData>(saveCost, { status: "idle" });
  const errors = state.status === "error" ? state.errors : {};
  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Field id="month" label="Mes" error={errors.month}>
          <Input id="month" name="month" type="month" defaultValue={month} {...describe("month", errors.month)} />
        </Field>
        <Field id="channel" label="Canal" error={errors.channel}>
          <Input id="channel" name="channel" list="channels" placeholder="instagram" {...describe("channel", errors.channel)} />
          <datalist id="channels">
            {["instagram", "facebook", "google", "tiktok", "medico", "directo"].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field id="amount_mxn" label="Gasto en pesos" error={errors.amountMxn}>
          <Input
            id="amount_mxn"
            name="amount_mxn"
            inputMode="decimal"
            placeholder="0"
            {...describe("amount_mxn", errors.amountMxn)}
          />
        </Field>
        <Field id="hours" label="Horas" optional>
          <Input id="hours" name="hours" inputMode="decimal" placeholder="0" />
        </Field>
      </div>
      <Field id="note" label="Nota" optional>
        <Input id="note" name="note" placeholder="Por ejemplo, anuncios de la campaña fundadores" />
      </Field>
      {state.status === "ok" && (
        <Notice tone="jade" title="Guardado" live="polite">
          Si el canal y el mes ya existían, reemplazamos el registro.
        </Notice>
      )}
      <Button pending={pending} pendingLabel="Guardando…" className="justify-self-start">
        Guardar gasto
      </Button>
    </form>
  );
}
