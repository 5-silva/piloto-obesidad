"use client";

import { useEffect } from "react";

// Guarda el canal de origen (utm_* y ref) durante la visita y registra la
// vista de la landing y los clics en botones marcados con data-cta.
// No usa cookies ni manda datos personales: solo un id de sesión aleatorio.

const KEY = "constante_attr";
const SID = "constante_sid";

export type Attr = { utm_source?: string; utm_medium?: string; utm_campaign?: string; ref?: string };

function read<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // navegación privada o almacenamiento bloqueado: seguimos sin guardar
  }
}

let fallbackSid: string | null = null;

export function sessionId(): string {
  const stored = read<string>(SID);
  if (stored) return stored;
  const sid = fallbackSid ?? crypto.randomUUID();
  fallbackSid = sid;
  write(SID, sid);
  return sid;
}

export function attribution(): Attr {
  const fromUrl: Attr = {};
  const params = new URLSearchParams(window.location.search);
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "ref"] as const) {
    const v = params.get(k);
    if (v) fromUrl[k] = v.slice(0, 60);
  }
  if (Object.keys(fromUrl).length > 0) {
    write(KEY, fromUrl);
    return fromUrl;
  }
  return read<Attr>(KEY) ?? {};
}

function send(name: "landing_view" | "cta_click") {
  const body = JSON.stringify({ name, sessionId: sessionId(), ...attribution() });
  if (navigator.sendBeacon?.("/api/events", new Blob([body], { type: "application/json" }))) return;
  void fetch("/api/events", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
}

export function LandingBeacon() {
  useEffect(() => {
    send("landing_view");
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("[data-cta]");
      if (target) send("cta_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
