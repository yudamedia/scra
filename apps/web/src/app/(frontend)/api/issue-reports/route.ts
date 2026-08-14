import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { getPayloadClient } from "@/lib/payload";
import { issueReportSchema } from "@/lib/issue-report-schema";
import { auth } from "@/lib/auth";
import { sendIssueReportConfirmationEmail } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MIN_FILL_TIME_MS = 3000;

export async function POST(req: NextRequest) {
  const form = await req.formData();

  // Honeypot: real visitors never fill this hidden field.
  if (String(form.get("website") ?? "").length > 0) {
    return NextResponse.json({ ok: true, referenceCode: null });
  }

  const renderedAt = Number(form.get("renderedAt") ?? 0);
  if (!renderedAt || Date.now() - renderedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ error: "Please try again." }, { status: 400 });
  }

  const recaptcha = await verifyRecaptcha(form.get("recaptchaToken"), { action: "issue_report" });
  if (!recaptcha.ok) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  const parsed = issueReportSchema.safeParse({
    reporterName: form.get("reporterName"),
    reporterPhone: form.get("reporterPhone") || undefined,
    reporterEmail: form.get("reporterEmail") || undefined,
    category: form.get("category"),
    description: form.get("description"),
    addressText: form.get("addressText") || undefined,
    lat: form.get("lat") || undefined,
    lng: form.get("lng") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const payload = await getPayloadClient();

  const photoFiles = form
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_PHOTOS);

  const photos: { image: number }[] = [];
  for (const file of photoFiles) {
    if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await payload.create({
      collection: "media",
      data: { alt: `Issue report photo — ${data.category}` },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    });
    photos.push({ image: media.id });
  }

  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);

  const report = await payload.create({
    collection: "issue-reports",
    data: {
      reporterName: data.reporterName,
      reporterPhone: data.reporterPhone,
      reporterEmail: data.reporterEmail || undefined,
      reportedBy: session?.user.id,
      category: data.category,
      description: data.description,
      photos,
      location: {
        lat: data.lat,
        lng: data.lng,
        addressText: data.addressText,
      },
      status: "received",
      statusHistory: [{ status: "received", changedAt: new Date().toISOString() }],
    },
  });

  if (data.reporterEmail) {
    await sendIssueReportConfirmationEmail(data.reporterEmail, {
      name: data.reporterName,
      referenceCode: report.referenceCode!,
      category: data.category,
    }).catch((err) => console.error("[email] issue report confirmation failed:", err));
  }

  return NextResponse.json({ ok: true, referenceCode: report.referenceCode });
}
