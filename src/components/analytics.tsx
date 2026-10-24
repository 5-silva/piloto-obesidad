"use client";

import { Analytics } from "@vercel/analytics/next";

// Analítica de visitas sin cookies. Solo páginas públicas y sin tokens:
// ni el panel, ni el portal, ni la liga personal del cuestionario.
export function PublicAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = new URL(event.url);
        if (/^\/(panel|portal|login)/.test(url.pathname)) return null;
        if (url.pathname.startsWith("/tamizaje/")) url.pathname = "/tamizaje/[liga]";
        for (const key of [...url.searchParams.keys()]) {
          if (!key.startsWith("utm_") && key !== "ref") url.searchParams.delete(key);
        }
        return { ...event, url: url.toString() };
      }}
    />
  );
}
