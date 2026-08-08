import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";
import { computeReminderStage, type ReminderStage } from "@/lib/memberships";
import { sendRenewalReminderEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayloadClient();
  const { docs: memberships } = await payload.find({
    collection: "memberships",
    where: { adminRevoked: { not_equals: true } },
    limit: 0,
    depth: 0,
  });

  let sent = 0;
  let skipped = 0;

  for (const membership of memberships) {
    if (!membership.expiryDate) continue;

    const stage = computeReminderStage(new Date(membership.expiryDate));
    const lastStage = (membership.lastReminderStage ?? "none") as ReminderStage;

    // Idempotency: a same-day cron re-run (or a run that lands on the same
    // window twice) is a no-op once this stage has already been recorded.
    if (!stage || stage === lastStage) {
      skipped++;
      continue;
    }

    const email = membership.primaryContact?.email;
    if (email) {
      await sendRenewalReminderEmail(email, {
        name: `${membership.primaryContact?.firstName ?? ""} ${membership.primaryContact?.surname ?? ""}`.trim(),
        stage,
        expiryDate: membership.expiryDate,
        membershipNumber: membership.membershipNumber ?? "",
      });
      sent++;
    } else {
      skipped++;
    }

    await payload.update({
      collection: "memberships",
      id: membership.id,
      data: { lastReminderStage: stage },
    });
  }

  return NextResponse.json({ ok: true, sent, skipped, total: memberships.length });
}
