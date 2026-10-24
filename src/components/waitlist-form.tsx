"use client";

import Link from "next/link";
import { submitWithoutReset, useFocusFirstError } from "@/components/form-utils";
import { useActionState, useEffect, useState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { attribution, sessionId, type Attr } from "@/components/attribution";
import { MX_STATES } from "@/lib/validation";

const GLP1_OPTIONS = [
  ["actualmente", "Sí, ya lo uso"],
  ["por_iniciar", "Lo voy a iniciar"],
  ["no", "No, pero me interesa"],
  ["no_se", "No estoy seguro"],
] as const;

export function WaitlistForm() {
  const [state, action, pending] = useActionState<WaitlistState, FormData>(joinWaitlist, { status: "idle" });
  const [attr, setAttr] = useState<Attr>({});
  const [sid, setSid] = useState("");
  const formRef = useFocusFirstError(state);

  useEffect(() => {
    // Lee el canal de origen guardado por la landing al montar el formulario.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttr(attribution());
    setSid(sessionId());
  }, []);

  if (state.status === "ok") {
    return (
      <div role="status" className="rounded-2xl bg-hoja p-6 sm:p-8">
        <h3 className="text-xl font-bold">{state.firstName ? `Listo, ${state.firstName}.` : "Listo."} Ya estás en la lista</h3>
        <p className="mt-3 max-w-prose">
          Te escribiremos por WhatsApp en los próximos días. Si contestas ahora el cuestionario de 5 minutos, el
          médico puede revisar tu caso antes.
        </p>
        <Link href={state.screeningPath} className="btn btn-primary mt-5">
          Contestar el cuestionario
        </Link>
        <p className="hint mt-3">También te mandamos la liga por correo.</p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};
  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="error">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {};

  return (
    <form ref={formRef} action={action} onSubmit={submitWithoutReset(action)} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="name" className="label">
            Nombre
          </label>
          <input id="name" name="name" autoComplete="name" className="input" defaultValue={values.name} {...aria("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="phone" className="label">
            Celular con WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="55 1234 5678"
            className="input"
            defaultValue={values.phone}
            {...aria("phone")}
          />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor="email" className="label">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="input"
            defaultValue={values.email}
            {...aria("email")}
          />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="state" className="label">
            Estado donde vives
          </label>
          <select id="state" name="state" className="input" defaultValue={values.state ?? ""} {...aria("state")}>
            <option value="" disabled>
              Elige tu estado
            </option>
            {MX_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err("state")}
        </div>
      </div>

      <fieldset className="grid gap-2" {...(errors.glp1 ? { "aria-describedby": "glp1-error" } : {})}>
        <legend className="label mb-2">¿Usas un medicamento para bajar de peso?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {GLP1_OPTIONS.map(([value, label]) => (
            <label key={value} className="choice">
              <input type="radio" name="glp1" value={value} defaultChecked={values.glp1 === value} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {err("glp1")}
      </fieldset>

      <label className="choice bg-transparent">
        <input type="checkbox" name="consent" {...aria("consent")} />
        <span className="text-sm">
          Acepto el{" "}
          <Link href="/aviso-de-privacidad" className="underline" target="_blank">
            aviso de privacidad
          </Link>{" "}
          y que me contacten por WhatsApp y correo sobre el programa.
        </span>
      </label>
      {err("consent")}

      {/* Campo trampa para bots: las personas no lo ven */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Sitio web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="sid" value={sid} />
      <input type="hidden" name="utm_source" value={attr.utm_source ?? ""} />
      <input type="hidden" name="utm_medium" value={attr.utm_medium ?? ""} />
      <input type="hidden" name="utm_campaign" value={attr.utm_campaign ?? ""} />
      <input type="hidden" name="ref" value={attr.ref ?? ""} />

      {errors.form && (
        <p role="alert" className="error">
          {errors.form}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Guardando…" : "Unirme a la lista de espera"}
        </button>
        <p className="hint">Hoy no cobramos nada.</p>
      </div>
    </form>
  );
}
