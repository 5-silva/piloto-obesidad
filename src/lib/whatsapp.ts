// Enlaces de WhatsApp con mensaje prellenado. En el piloto el equipo escribe
// desde WhatsApp Business; estos enlaces le ahorran redactar cada mensaje.
import { site } from "@/lib/config";

export function waLink(phone10: string, text: string): string {
  return `https://wa.me/52${phone10}?text=${encodeURIComponent(text)}`;
}

/** Enlace para que el paciente escriba al equipo. */
export function teamWaLink(text: string): string | null {
  return site.whatsappNumber ? waLink(site.whatsappNumber, text) : null;
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export const templates = {
  firstContact: (name: string, screeningUrl: string) =>
    `Hola, ${firstName(name)}. Soy del equipo de ${site.brand}. Gracias por unirte a la lista de espera. ` +
    `Para saber si el programa es para ti, contesta este cuestionario de 5 minutos: ${screeningUrl}`,
  schedule: (name: string) =>
    `Hola, ${firstName(name)}. Revisamos tu cuestionario y el siguiente paso es una valoración por videollamada con el médico. ` +
    (site.calUrl ? `Elige tu horario aquí: ${site.calUrl}` : "¿Qué días y horarios te acomodan?"),
  checkinReminder: (name: string, week: number) =>
    `Hola, ${firstName(name)}. Ya puedes registrar tu check-in de la semana ${week} en ${site.url}/portal. Toma 2 minutos.`,
  followUpFlag: (name: string) =>
    `Hola, ${firstName(name)}. Vimos tu check-in y queremos saber cómo sigues. ¿Podemos llamarte hoy?`,
};
