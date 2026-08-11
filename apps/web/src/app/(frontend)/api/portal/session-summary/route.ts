import { NextResponse } from "next/server";

import { getPortalSession } from "@/lib/portal";

// Backs the sitewide member topbar (rendered client-side so it can react
// instantly to sign-in/out) — the only thing it needs beyond "is there a
// session" (already known via useSession()) is the membership number to
// display.
export async function GET() {
  const { session, membership } = await getPortalSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  return NextResponse.json({ membershipNumber: membership?.membershipNumber ?? null });
}
