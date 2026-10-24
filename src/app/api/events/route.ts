import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepo } from "@/lib/data";

const clean = z
  .string()
  .max(100)
  .optional()
  .transform((v) => (v ? v.replace(/[^\w\-.]/g, "").slice(0, 60) || null : null));

const schema = z.object({
  name: z.enum(["landing_view", "cta_click"]),
  sessionId: z.string().regex(/^[\w-]{8,64}$/),
  utm_source: clean,
  utm_medium: clean,
  utm_campaign: clean,
  ref: clean,
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const e = parsed.data;
  await getRepo().recordEvent({
    name: e.name,
    sessionId: e.sessionId,
    utmSource: e.utm_source,
    utmMedium: e.utm_medium,
    utmCampaign: e.utm_campaign,
    refCode: e.ref,
  });
  return new NextResponse(null, { status: 204 });
}
