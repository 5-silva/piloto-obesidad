"use client";

import Link from "next/link";
import { useActionState } from "react";
import { activatePatient, type ActivateState } from "@/app/actions/panel";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Notice } from "@/components/ui/surface";

export function ActivateForm({ leadId, today }: { leadId: string; today: string }) {
  const [state, action, pending] = useActionState<ActivateState, FormData>(activatePatient, { status: "idle" });
  if (state.status === "ok") {
    return (
      <Notice tone="jade" title="Paciente activo" live="polite">
        Ya puede entrar al portal con su correo.{" "}
        <Link href={`/panel/pacientes/${state.patientId}`} className="font-semibold text-tinta underline">
          Ver paciente
        </Link>
      </Notice>
    );
  }
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="leadId" value={leadId} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="startDate" label="Su lunes 1" hint="De preferencia un lunes: el check-in cae cada lunes.">
          <Input id="startDate" name="startDate" type="date" defaultValue={today} aria-describedby="startDate-hint" />
        </Field>
        <Field id="programFormat" label="Formato">
          <Select id="programFormat" name="programFormat" defaultValue="individual">
            <option value="individual">Individual</option>
            <option value="grupal">Grupal</option>
          </Select>
        </Field>
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-sm font-semibold text-alerta">
          {state.message}
        </p>
      )}
      <Button pending={pending} pendingLabel="Activando…" className="justify-self-start">
        Activar como paciente
      </Button>
    </form>
  );
}
