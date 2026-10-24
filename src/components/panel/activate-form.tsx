"use client";

import Link from "next/link";
import { useActionState } from "react";
import { activatePatient, type ActivateState } from "@/app/actions/panel";

export function ActivateForm({ leadId, today }: { leadId: string; today: string }) {
  const [state, action, pending] = useActionState<ActivateState, FormData>(activatePatient, { status: "idle" });
  if (state.status === "ok") {
    return (
      <p role="status" className="rounded-lg bg-hoja p-3">
        Paciente activo. Ya puede entrar al portal con su correo.{" "}
        <Link href={`/panel/pacientes/${state.patientId}`} className="font-bold underline">
          Ver paciente
        </Link>
      </p>
    );
  }
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <input type="hidden" name="leadId" value={leadId} />
      <div className="field">
        <label htmlFor="startDate" className="label">
          Semana 1 empieza
        </label>
        <input id="startDate" name="startDate" type="date" defaultValue={today} className="input" />
      </div>
      <div className="field">
        <label htmlFor="programFormat" className="label">
          Formato
        </label>
        <select id="programFormat" name="programFormat" className="input" defaultValue="individual">
          <option value="individual">Individual</option>
          <option value="grupal">Grupal</option>
        </select>
      </div>
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Activando…" : "Activar como paciente"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="error sm:col-span-3">
          {state.message}
        </p>
      )}
    </form>
  );
}
