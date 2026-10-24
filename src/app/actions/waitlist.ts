"use server";

import { after } from "next/server";
import { site } from "@/lib/config";
import { getRepo } from "@/lib/data";
import { mails, sendMail } from "@/lib/email";
import { parseLeadForm, type FieldErrors } from "@/lib/validation";

export type WaitlistState =
  | { status: "idle" }
  | { status: "error"; errors: FieldErrors; values: Record<string, string> }
  | { status: "ok"; firstName: string; screeningPath: string };

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const parsed = parseLeadForm(formData);
  const values = Object.fromEntries(["name", "email", "phone", "state", "glp1"].map((k) => [k, String(formData.get(k) ?? "")]));
  if (!parsed.ok) {
    // Un bot que llenó el campo oculto ve "éxito" y no se guarda nada.
    if (parsed.errors.website) return { status: "ok", firstName: "", screeningPath: "/" };
    return { status: "error", errors: parsed.errors, values };
  }

  const d = parsed.data;
  const repo = getRepo();
  try {
    const { screeningToken } = await repo.createLead({
      name: d.name,
      email: d.email,
      phone: d.phone,
      state: d.state,
      glp1: d.glp1,
      utmSource: d.utmSource,
      utmMedium: d.utmMedium,
      utmCampaign: d.utmCampaign,
      refCode: d.refCode,
      priceShownMxn: site.priceMxn,
      privacyVersion: site.privacyVersion,
    });
    const screeningPath = `/tamizaje/${screeningToken}`;
    const sid = String(formData.get("sid") ?? "");

    after(async () => {
      if (/^[\w-]{8,64}$/.test(sid)) {
        await repo.recordEvent({
          name: "waitlist_submit",
          sessionId: sid,
          utmSource: d.utmSource,
          utmMedium: d.utmMedium,
          utmCampaign: d.utmCampaign,
          refCode: d.refCode,
        });
      }
      await sendMail({ to: d.email, ...mails.waitlistConfirmation(d.name, `${site.url}${screeningPath}`) });
    });

    return { status: "ok", firstName: d.name.split(/\s+/)[0], screeningPath };
  } catch (err) {
    console.error("[lista de espera]", err);
    return {
      status: "error",
      errors: { form: "No pudimos guardar tus datos. Intenta de nuevo en un momento." },
      values,
    };
  }
}
