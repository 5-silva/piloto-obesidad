"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { attribution, sessionId, type Attr } from "@/components/attribution";
import { submitWithoutReset, useFocusFirstError, useReveal } from "@/components/form-utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice";
import { describe, Field, FieldError, Input, PrefixInput, Select } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { MX_STATES } from "@/lib/validation";

const GLP1_OPTIONS = [
  ["actualmente", "Sí, ya lo uso"],
  ["por_iniciar", "Lo voy a iniciar"],
  ["no", "No, pero me interesa"],
  ["no_se", "No lo sé"],
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

  if (state.status === "ok") return <WaitlistSuccess firstName={state.firstName} screeningPath={state.screeningPath} />;

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};

  return (
    <form ref={formRef} action={action} onSubmit={submitWithoutReset(action)} noValidate className="grid gap-6">
      <Field id="name" label="Nombre" error={errors.name}>
        <Input id="name" name="name" autoComplete="name" defaultValue={values.name} {...describe("name", errors.name)} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="phone" label="Celular con WhatsApp" error={errors.phone}>
          <PrefixInput
            prefix="+52"
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="55 1234 5678"
            defaultValue={values.phone}
            {...describe("phone", errors.phone)}
          />
        </Field>
        <Field id="email" label="Correo" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            defaultValue={values.email}
            {...describe("email", errors.email)}
          />
        </Field>
      </div>
      <Field id="state" label="Estado donde vives" error={errors.state}>
        <Select id="state" name="state" defaultValue={values.state ?? ""} {...describe("state", errors.state)}>
          <option value="" disabled>
            Elige tu estado
          </option>
          {MX_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>

      <fieldset className="grid gap-3" aria-describedby={errors.glp1 ? "glp1-error" : undefined}>
        <legend className="mb-3 font-semibold">¿Usas un medicamento para bajar de peso?</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {GLP1_OPTIONS.map(([value, label]) => (
            <ChoiceCard key={value} type="radio" name="glp1" value={value} defaultChecked={values.glp1 === value} label={label} />
          ))}
        </div>
        {errors.glp1 && <FieldError id="glp1-error">{errors.glp1}</FieldError>}
      </fieldset>

      <div className="grid gap-2">
        <label className="flex cursor-pointer gap-3 text-sm text-tinta-2">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-5 w-5 flex-none accent-tinta"
            {...describe("consent", errors.consent)}
          />
          <span>
            Acepto el{" "}
            <Link href="/aviso-de-privacidad" className="font-semibold text-tinta underline underline-offset-2" target="_blank">
              aviso de privacidad
            </Link>{" "}
            y que me contacten por WhatsApp y correo sobre el programa.
          </span>
        </label>
        {errors.consent && <FieldError id="consent-error">{errors.consent}</FieldError>}
      </div>

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
        <p role="alert" className="rounded-xl bg-alerta-suave p-3 text-sm font-semibold text-alerta">
          {errors.form}
        </p>
      )}
      <div className="grid gap-3">
        <Button type="submit" size="lg" full pending={pending} pendingLabel="Enviando…">
          Pedir mi lugar
        </Button>
        <p className="flex items-center justify-center gap-2 text-sm text-piedra">
          <Icon name="lock" className="h-4 w-4" />
          Hoy no cobramos nada. No compartimos tus datos con anunciantes.
        </p>
      </div>
    </form>
  );
}

function WaitlistSuccess({ firstName, screeningPath }: { firstName: string; screeningPath: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} tabIndex={-1} role="status" className="paso-entra grid justify-items-start gap-4 outline-none">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jade text-blanco">
        <Icon name="check" className="h-6 w-6" strokeWidth={2.6} />
      </span>
      <h3 className="text-2xl">{firstName ? `Listo, ${firstName}.` : "Listo."} Ya estás en la lista.</h3>
      <p className="max-w-[32rem] text-tinta-2">
        Te escribiremos por WhatsApp en los próximos días. Si contestas ahora el cuestionario de cinco minutos, el médico puede
        revisar tu caso antes.
      </p>
      <ButtonLink href={screeningPath} size="lg" className="mt-2">
        Contestar el cuestionario
      </ButtonLink>
      <p className="text-sm text-piedra">También te mandamos la liga por correo, por si prefieres hacerlo después.</p>
    </div>
  );
}
