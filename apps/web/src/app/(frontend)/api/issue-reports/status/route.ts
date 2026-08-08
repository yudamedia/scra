import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim();
  if (!code) {
    return NextResponse.json({ error: "Missing reference code" }, { status: 400 });
  }

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "issue-reports",
    where: { referenceCode: { equals: code } },
    limit: 1,
  });

  const report = docs[0];
  if (!report) {
    return NextResponse.json({ error: "No report found for that reference code" }, { status: 404 });
  }

  // Only the safe subset — never expose reporter contact info to an
  // anonymous status lookup.
  return NextResponse.json({
    referenceCode: report.referenceCode,
    category: report.category,
    status: report.status,
    statusHistory: report.statusHistory ?? [],
    createdAt: report.createdAt,
  });
}
