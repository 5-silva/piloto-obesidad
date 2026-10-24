// Configuración visible del piloto. Todo lo que cambia entre ambientes o
// decisiones del equipo (marca, precio, contactos) vive aquí y en variables
// de entorno, no repartido en las páginas.

export const site = {
  brand: process.env.NEXT_PUBLIC_BRAND_NAME || "Lunes",
  priceMxn: Number(process.env.NEXT_PUBLIC_PRICE_MXN || 2500),
  // Número de WhatsApp del piloto, 10 dígitos de México (sin +52).
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  // Enlace público de agenda (Cal.com) para la valoración inicial.
  calUrl: process.env.NEXT_PUBLIC_CAL_URL || "",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  // Persona responsable de los datos en el aviso de privacidad.
  privacyOwner: process.env.NEXT_PUBLIC_PRIVACY_OWNER || "",
  privacyAddress: process.env.NEXT_PUBLIC_PRIVACY_ADDRESS || "",
  // Versión del aviso que acepta cada persona; cambia cuando cambie el texto.
  privacyVersion: "2026-10-24-borrador",
  // El cobro se enciende solo tras el visto bueno legal.
  paymentsEnabled: process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true",
  depositUrl: process.env.NEXT_PUBLIC_DEPOSIT_URL || "",
} as const;

export const CRISIS_LINE = { name: "Línea de la Vida", phone: "800 911 2000" } as const;

export function formatMxn(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}
