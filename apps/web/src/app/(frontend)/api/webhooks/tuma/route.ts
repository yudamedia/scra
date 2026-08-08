import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";
import { verifyWebhookSignature } from "@/lib/tuma";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-tuma-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { payment_id?: string; status?: string };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.payment_id) {
    return NextResponse.json({ error: "Missing payment_id" }, { status: 400 });
  }

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "payments",
    where: { tumaPaymentId: { equals: body.payment_id } },
    limit: 1,
  });

  const payment = docs[0];
  if (!payment) {
    return NextResponse.json({ error: "No matching payment record" }, { status: 404 });
  }

  // Tuma callbacks can arrive late, twice, or (rarely) not at all — only act
  // on a transition into `confirmed`; the Payments afterChange hook takes it
  // from there and is the single activation path either way.
  if (payment.paymentStatus !== "confirmed" && body.status === "confirmed") {
    await payload.update({
      collection: "payments",
      id: payment.id,
      data: {
        paymentStatus: "confirmed",
        confirmedAt: new Date().toISOString(),
        rawWebhookPayload: body,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
