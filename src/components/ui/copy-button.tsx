"use client";

import { useState } from "react";
import { buttonClass } from "./button";
import { Icon } from "./icon";

/** Copia un texto al portapapeles y confirma en el mismo botón. */
export function CopyButton({ text, label = "Copiar", done = "Copiada" }: { text: string; label?: string; done?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={buttonClass({ variant: "secondary", size: "sm" })}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copia la liga:", text);
        }
      }}
    >
      <Icon name={copied ? "check" : "copy"} className="h-4 w-4" strokeWidth={2.4} />
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}
