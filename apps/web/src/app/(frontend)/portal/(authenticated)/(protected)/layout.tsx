import { redirect } from "next/navigation";

import { getPortalSession } from "@/lib/portal";
import { isMembershipActive } from "@/lib/memberships";

export default async function PortalProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { membership } = await getPortalSession();

  // No linked membership at all, or a lapsed one — no partial access to
  // protected content, but /portal/account and /portal/renew (outside this
  // nested layout) stay reachable either way.
  if (!membership || !isMembershipActive(membership)) {
    redirect("/portal/renew");
  }

  return <>{children}</>;
}
