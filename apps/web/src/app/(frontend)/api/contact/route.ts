import { NextRequest, NextResponse } from "next/server";

import { contactSchema } from "@/lib/contact-schema";
import { sendContactFormEmail } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

const MIN_FILL_TIME_MS = 3000;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (String(body.website ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }

  const renderedAt = Number(body.renderedAt ?? 0);
  if (!renderedAt || Date.now() - renderedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ error: "Please try again." }, { status: 400 });
  }

  const recaptcha = await verifyRecaptcha(body.recaptchaToken, { action: "contact" });
  if (!recaptcha.ok) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  await sendContactFormEmail(parsed.data);

  return NextResponse.json({ ok: true });
}
