import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { getPayloadClient } from "@/lib/payload";
import { getPortalSession } from "@/lib/portal";
import { isMembershipActive } from "@/lib/memberships";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await getPayloadClient();
  const doc = await payload.findByID({ collection: "documents", id }).catch(() => null);

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (doc.visibility === "membersOnly") {
    const { membership } = await getPortalSession();
    if (!membership || !isMembershipActive(membership)) {
      return NextResponse.json({ error: "This document is available to active members only" }, { status: 403 });
    }
  }

  if (!doc.filename) {
    return NextResponse.json({ error: "No file attached to this record" }, { status: 404 });
  }

  const filePath = path.resolve(process.cwd(), "documents", doc.filename);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File missing on disk" }, { status: 404 });
  }

  const fileBuffer = await fs.promises.readFile(filePath);
  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${doc.filename}"`,
    },
  });
}
