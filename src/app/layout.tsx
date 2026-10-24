import type { Metadata, Viewport } from "next";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import { PublicAnalytics } from "@/components/analytics";
import { site } from "@/lib/config";
import { isDemo } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.brand} · Acompañamiento para tu tratamiento de peso`, template: `%s · ${site.brand}` },
  description:
    "Seguimiento médico y nutricional semana a semana para personas que usan o van a iniciar un medicamento para bajar de peso. 100% en línea, en todo México.",
  openGraph: { locale: "es_MX", type: "website", siteName: site.brand },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className="h-full">
      <body className="flex min-h-full flex-col">
        {isDemo() && (
          <aside
            aria-label="Aviso de demostración"
            className="bg-aviso-suave px-4 py-2 text-center text-xs font-semibold text-aviso sm:text-sm"
          >
            Versión de demostración con datos ficticios. No escribas datos reales.
          </aside>
        )}
        {children}
        <PublicAnalytics />
      </body>
    </html>
  );
}
