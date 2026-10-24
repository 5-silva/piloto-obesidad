"use client";

import { startTransition, useActionState } from "react";
import { requestCode, verifyCode, type LoginState } from "@/app/actions/auth";
import { submitWithoutReset } from "@/components/form-utils";
import { Button } from "@/components/ui/button";
import { describe, Field, Input } from "@/components/ui/field";

export function LoginForm({ next, demo = false }: { next: string; demo?: boolean }) {
  const [sent, request, requesting] = useActionState<LoginState, FormData>(requestCode, { status: "idle" });
  const [verified, verify, verifying] = useActionState<LoginState, FormData>(verifyCode, { status: "idle" });

  const email = sent.status === "code_sent" ? sent.email : verified.status === "error" && verified.email ? verified.email : null;
  const showCode = email !== null && !(verified.status === "error" && verified.step === "email");

  if (!showCode) {
    const error = sent.status === "error" ? sent.message : undefined;
    return (
      <form action={request} onSubmit={submitWithoutReset(request)} className="grid gap-5" noValidate>
        <Field id="email" label="Tu correo" error={error} hint="El mismo con el que te registraste.">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            {...describe("email", error, true)}
          />
        </Field>
        <Button size="lg" full pending={requesting} pendingLabel="Enviando código…">
          Mandarme un código
        </Button>
      </form>
    );
  }

  const codeError = verified.status === "error" ? verified.message : undefined;
  return (
    <form action={verify} onSubmit={submitWithoutReset(verify)} className="paso-entra grid gap-5" noValidate>
      <p className="text-tinta-2">
        Si <strong className="text-tinta">{email}</strong> está registrado, te llegó un código de 6 dígitos. Revisa también tu
        carpeta de spam.
        {demo && <span className="mt-2 block font-semibold text-tinta">En la demo, el código es 123456.</span>}
      </p>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <Field id="token" label="Código" error={codeError}>
        <Input
          id="token"
          name="token"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={7}
          className="h-16 max-w-[14rem] text-center text-2xl font-semibold tracking-[0.4em] tabular-nums"
          autoFocus
          required
          {...describe("token", codeError)}
        />
      </Field>
      <Button size="lg" full pending={verifying} pendingLabel="Entrando…">
        Entrar
      </Button>
      <Button
        type="button"
        variant="quiet"
        className="justify-self-center"
        disabled={requesting}
        onClick={() => {
          const fd = new FormData();
          fd.set("email", email);
          startTransition(() => request(fd));
        }}
      >
        {requesting ? "Enviando…" : "Mandarme otro código"}
      </Button>
    </form>
  );
}
