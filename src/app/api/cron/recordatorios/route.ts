import { NextResponse } from "next/server";
import { getRepo } from "@/lib/data";
import { todayMx } from "@/lib/dates";
import { mails, sendMail } from "@/lib/email";
import { dueReminders } from "@/lib/reminders";

// Vercel Cron llama esta ruta todos los días a las 10:00 de CDMX (vercel.json)
// y envía el encabezado Authorization: Bearer <CRON_SECRET>.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse(null, { status: 401 });
  }
  const today = todayMx();
  const { patients, checkins } = await getRepo().reminderData();
  const due = dueReminders(patients, checkins, today);
  let sent = 0;
  for (const r of due) {
    const res = await sendMail({ to: r.patient.email, ...mails.checkinReminder(r.patient.displayName, r.week, r.late) });
    if (res.sent) sent++;
  }
  return NextResponse.json({ today, due: due.length, sent });
}
