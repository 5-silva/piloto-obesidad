import type { NextConfig } from "next";

// Sin Cache Components: casi todo depende de la sesión o de datos en vivo,
// y el renderizado dinámico clásico es más simple de razonar en el piloto.
const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // Las ligas de tamizaje llevan un token en la ruta: nunca se comparte la ruta completa.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const privateArea = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: security },
      { source: "/tamizaje/:path*", headers: privateArea },
      { source: "/panel/:path*", headers: privateArea },
      { source: "/portal/:path*", headers: privateArea },
      { source: "/login", headers: privateArea },
    ];
  },
};

export default nextConfig;
