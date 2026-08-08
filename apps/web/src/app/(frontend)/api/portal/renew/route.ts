import { NextRequest, NextResponse } from "next/server";

import { getPortalSession } from "@/lib/portal";
import { subscriptionAmountForType } from "@/lib/memberships";
import { getPayloadClient } from "@/lib/payload";

export async function POST(req: NextRequest) {
  const { session, membership } = await getPortalSession();
  if (!session || !membership) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const method = body.method === "cash" ? "cash" : "bank_transfer";

  const payload = await getPayloadClient();
  const payment = await payload.create({
    collection: "payments",
    data: {
      membership: membership.id,
      amount: membership.subscriptionAmount ?? subscriptionAmountForType[membership.type] ?? 0,
      method,
      provider: "manual",
      paymentStatus: "pending",
      paymentType: "renewal",
    },
  });

  return NextResponse.json({ paymentId: payment.id });
}
