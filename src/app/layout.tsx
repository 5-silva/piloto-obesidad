import type { Metadata, Viewport } from "next";
import "@fontsource-variable/atkinson-hyperlegible-next";
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

export const viewport: Viewport = { themeColor: "#fafbf9" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {isDemo() && (
          <div role="note" className="bg-aviso-fondo text-aviso text-sm px-4 py-2 text-center">
            Versión de demostración con datos ficticios. No escribas datos reales.
          </div>
        )}
        {children}
        <PublicAnalytics />
      </body>
    </html>
  );
}
