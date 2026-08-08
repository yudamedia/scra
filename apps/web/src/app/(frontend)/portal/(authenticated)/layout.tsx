import { redirect } from "next/navigation";

import { getPortalSession } from "@/lib/portal";
import { PortalTopbar } from "@/components/portal-topbar";

export default async function PortalAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, membership } = await getPortalSession();
  if (!session) redirect("/portal/login");

  return (
    <>
      <PortalTopbar membershipNumber={membership?.membershipNumber} />
      {children}
    </>
  );
}
