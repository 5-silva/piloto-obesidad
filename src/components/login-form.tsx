"use client";

import { startTransition, useActionState } from "react";
import { requestCode, verifyCode, type LoginState } from "@/app/actions/auth";
import { submitWithoutReset } from "@/components/form-utils";

export function LoginForm({ next }: { next: string }) {
  const [sent, request, requesting] = useActionState<LoginState, FormData>(requestCode, { status: "idle" });
  const [verified, verify, verifying] = useActionState<LoginState, FormData>(verifyCode, { status: "idle" });

  const email =
    sent.status === "code_sent" ? sent.email : verified.status === "error" && verified.email ? verified.email : null;
  const showCode = email !== null && !(verified.status === "error" && verified.step === "email");

  if (!showCode) {
    return (
      <form action={request} onSubmit={submitWithoutReset(request)} className="mt-6 grid gap-4" noValidate>
        <div className="field">
          <label htmlFor="email" className="label">
            Correo
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className="input" required />
        </div>
        {sent.status === "error" && (
          <p role="alert" className="error">
            {sent.message}
          </p>
        )}
        <button className="btn btn-primary" disabled={requesting}>
          {requesting ? "Enviando…" : "Mandarme el código"}
        </button>
      </form>
    );
  }

  return (
    <form action={verify} onSubmit={submitWithoutReset(verify)} className="mt-6 grid gap-4" noValidate>
      <p>
        Si <strong>{email}</strong> está registrado, te llegó un código. Revisa también la carpeta de spam.
      </p>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="token" className="label">
          Código de 6 dígitos
        </label>
        <input
          id="token"
          name="token"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={7}
          className="input text-xl tracking-[0.3em]"
          autoFocus
          required
        />
      </div>
      {verified.status === "error" && (
        <p role="alert" className="error">
          {verified.message}
        </p>
      )}
      <button className="btn btn-primary" disabled={verifying}>
        {verifying ? "Entrando…" : "Entrar"}
      </button>
      <button
        type="button"
        className="justify-self-start text-sm underline"
        disabled={requesting}
        onClick={() => {
          const fd = new FormData();
          fd.set("email", email);
          startTransition(() => request(fd));
        }}
      >
        {requesting ? "Enviando…" : "Mandarme otro código"}
      </button>
    </form>
  );
}
