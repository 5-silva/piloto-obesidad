"use client";

import { startTransition, useEffect, useRef, type FormEvent } from "react";

/**
 * React reinicia el formulario después de una acción; con errores de
 * validación eso borraría lo que la persona escribió. Este envío lo evita.
 */
export function submitWithoutReset(dispatch: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}

/** Lleva el foco al primer campo con error para lectores de pantalla y teclado. */
export function useFocusFirstError(state: { status: string }) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status !== "error") return;
    const el = ref.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]');
    if (!el) return;
    if (el.getAttribute("role") === "alert") el.scrollIntoView({ block: "center" });
    else el.focus();
  }, [state]);
  return ref;
}
