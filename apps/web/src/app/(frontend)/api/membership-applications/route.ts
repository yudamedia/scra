import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";
import { membershipApplicationSchema } from "@/lib/membership-application-schema";
import { subscriptionAmountForType } from "@/lib/memberships";
import { sendMembershipApplicationConfirmationEmail } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

const MIN_FILL_TIME_MS = 3000;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real applicants never fill this hidden field.
  if (String(body.website ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }

  const renderedAt = Number(body.renderedAt ?? 0);
  if (!renderedAt || Date.now() - renderedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ error: "Please try again." }, { status: 400 });
  }

  const recaptcha = await verifyRecaptcha(body.recaptchaToken, { action: "membership_application" });
  if (!recaptcha.ok) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  const parsed = membershipApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const payload = await getPayloadClient();

  const membership = await payload.create({
    collection: "memberships",
    data: {
      type: data.type,
      primaryContact: {
        surname: data.surname,
        firstName: data.firstName,
        phone: data.phone,
        email: data.email,
      },
      postalAddress: data.postalAddress,
      town: data.town,
      postalCode: data.postalCode,
      corporateBusinessName: data.type === "corporate" ? data.corporateBusinessName : undefined,
      additionalMembers: (data.additionalMembers ?? [])
        .filter((m) => m.surname && m.firstName)
        .map((m) => ({
          surname: m.surname,
          firstName: m.firstName,
          phone: m.phone || undefined,
          email: m.email || undefined,
        })),
      subscriptionAmount: subscriptionAmountForType[data.type],
      // Not active until payment is confirmed — the activation hook sets
      // the real expiry date once the secretariat confirms the payment.
      expiryDate: new Date().toISOString(),
      importStatus: "native",
    },
  });

  await payload.create({
    collection: "payments",
    data: {
      membership: membership.id,
      amount: subscriptionAmountForType[data.type],
      method: data.paymentMethod,
      provider: "manual",
      paymentStatus: "pending",
      paymentType: "new",
    },
  });

  await sendMembershipApplicationConfirmationEmail(data.email, {
    name: `${data.firstName} ${data.surname}`,
    membershipNumber: membership.membershipNumber!,
    type: data.type,
    amount: subscriptionAmountForType[data.type],
    paymentMethod: data.paymentMethod,
  }).catch((err) => console.error("[email] membership application confirmation failed:", err));

  return NextResponse.json({ ok: true, membershipNumber: membership.membershipNumber });
}
