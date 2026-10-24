import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/config";

// Correos transaccionales. Nunca llevan datos de salud: solo avisos y enlaces.
// Sin RESEND_API_KEY (modo demo o desarrollo) se registran en consola.

type Mail = { to: string; subject: string; text: string };

let client: Resend | null = null;

export async function sendMail(mail: Mail): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.info(`[correo no enviado] ${mail.to} · ${mail.subject}`);
    return { sent: false };
  }
  client ??= new Resend(key);
  const { error } = await client.emails.send({
    from,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    replyTo: site.contactEmail || undefined,
  });
  if (error) {
    console.error(`[correo] ${mail.subject}: ${error.message}`);
    return { sent: false };
  }
  return { sent: true };
}

function first(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

const signature = `\n\nEquipo ${site.brand}\nSi tienes una urgencia médica llama al 911.`;

export const mails = {
  waitlistConfirmation: (name: string, screeningUrl: string): Omit<Mail, "to"> => ({
    subject: `Estás en la lista de espera de ${site.brand}`,
    text:
      `Hola, ${first(name)}:\n\nGracias por unirte. Somos un grupo pequeño de pacientes fundadores y te escribiremos por WhatsApp en los próximos días.\n\n` +
      `Para avanzar más rápido, contesta el cuestionario de 5 minutos con el que el médico revisa si el programa es para ti:\n${screeningUrl}\n\n` +
      `Hoy no cobramos nada.` +
      signature,
  }),
  checkinReminder: (name: string, week: number, late: boolean): Omit<Mail, "to"> => ({
    subject: late ? `Te falta tu check-in de la semana ${week}` : `Tu check-in de la semana ${week} está abierto`,
    text:
      `Hola, ${first(name)}:\n\n` +
      (late
        ? `Aún no registramos tu check-in de esta semana. Toma 2 minutos y nos ayuda a acompañarte mejor.`
        : `Empieza tu semana ${week}. Cuando puedas, registra tu peso y cómo te has sentido.`) +
      `\n\n${site.url}/portal` +
      signature,
  }),
  staffFlagAlert: (week: number): Omit<Mail, "to"> => ({
    subject: "Check-in con alerta: revisa el panel",
    text:
      `Un paciente marcó una alerta en su check-in de la semana ${week}. Revisa el panel y contáctalo hoy.\n\n${site.url}/panel/hoy` +
      `\n\nEste aviso no incluye datos de salud a propósito.`,
  }),
};
